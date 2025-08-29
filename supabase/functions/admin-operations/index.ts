import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RetailerData {
  id?: string;
  name: string;
  logo_url?: string;
  base_url: string;
  affiliate_id: string;
  commission_rate?: number;
  supports_api?: boolean;
  min_order_for_delivery?: number;
  delivery_fee_cents?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin access
    const { data: adminCheck, error: adminError } = await supabaseClient
      .rpc('verify_admin_access', { p_user_id: user.id });
    
    if (adminError || !adminCheck) {
      console.error('Admin verification failed:', adminError);
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    // Route to appropriate handler
    switch (req.method) {
      case 'GET':
        return await handleGet(supabaseClient, action);
      case 'POST':
        return await handlePost(supabaseClient, req, user.id);
      case 'PUT':
        return await handlePut(supabaseClient, req, user.id);
      case 'DELETE':
        return await handleDelete(supabaseClient, req, user.id);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleGet(supabaseClient: any, action: string | null) {
  switch (action) {
    case 'retailers':
      const { data: retailers, error: retailersError } = await supabaseClient
        .from('retailers')
        .select('*');
      
      if (retailersError) throw retailersError;
      
      return new Response(JSON.stringify({ data: retailers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    case 'products':
      const { data: products, error: productsError } = await supabaseClient
        .from('product_mappings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      
      return new Response(JSON.stringify({ data: products }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    case 'analytics':
      const { data: analytics, error: analyticsError } = await supabaseClient
        .from('affiliate_conversions')
        .select(`
          *,
          shopping_sessions!inner(
            estimated_total_cents,
            retailer_id,
            created_at
          )
        `);
      
      if (analyticsError) throw analyticsError;
      
      // Calculate analytics
      const totalRevenue = analytics.reduce((sum: number, conv: any) => 
        sum + (conv.actual_total_cents || 0), 0);
      const totalCommission = analytics.reduce((sum: number, conv: any) => 
        sum + (conv.commission_cents || 0), 0);
      
      const stats = {
        totalRevenue,
        totalCommission,
        totalConversions: analytics.length,
        conversionRate: analytics.length > 0 ? 
          (analytics.length / (analytics.length * 1.5)) * 100 : 0, // Simplified calculation
      };
      
      return new Response(JSON.stringify({ data: stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
}

async function handlePost(supabaseClient: any, req: Request, userId: string) {
  const { action, data } = await req.json();
  
  // Input validation and sanitization
  const sanitizedData = sanitizeRetailerData(data);
  
  switch (action) {
    case 'create_retailer':
      // Validate required fields
      if (!sanitizedData.name || !sanitizedData.base_url || !sanitizedData.affiliate_id) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: newRetailer, error: createError } = await supabaseClient
        .from('retailers')
        .insert([sanitizedData])
        .select()
        .single();
      
      if (createError) {
        console.error('Create retailer error:', createError);
        throw createError;
      }
      
      // Log the action
      await supabaseClient
        .from('security_audit_log')
        .insert({
          user_id: userId,
          action: 'create_retailer',
          resource_type: 'retailer',
          resource_id: newRetailer.id,
          metadata: { retailer_name: newRetailer.name }
        });
      
      return new Response(JSON.stringify({ data: newRetailer }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
}

async function handlePut(supabaseClient: any, req: Request, userId: string) {
  const { action, id, data } = await req.json();
  
  // Input validation and sanitization
  const sanitizedData = sanitizeRetailerData(data);
  
  switch (action) {
    case 'update_retailer':
      if (!id) {
        return new Response(JSON.stringify({ error: 'Missing retailer ID' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: updatedRetailer, error: updateError } = await supabaseClient
        .from('retailers')
        .update(sanitizedData)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Update retailer error:', updateError);
        throw updateError;
      }
      
      // Log the action
      await supabaseClient
        .from('security_audit_log')
        .insert({
          user_id: userId,
          action: 'update_retailer',
          resource_type: 'retailer',
          resource_id: id,
          metadata: { retailer_name: updatedRetailer.name }
        });
      
      return new Response(JSON.stringify({ data: updatedRetailer }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
}

async function handleDelete(supabaseClient: any, req: Request, userId: string) {
  const { action, id } = await req.json();
  
  switch (action) {
    case 'delete_retailer':
      if (!id) {
        return new Response(JSON.stringify({ error: 'Missing retailer ID' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get retailer info for logging
      const { data: retailerInfo } = await supabaseClient
        .from('retailers')
        .select('name')
        .eq('id', id)
        .single();

      const { error: deleteError } = await supabaseClient
        .from('retailers')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Delete retailer error:', deleteError);
        throw deleteError;
      }
      
      // Log the action
      await supabaseClient
        .from('security_audit_log')
        .insert({
          user_id: userId,
          action: 'delete_retailer',
          resource_type: 'retailer',
          resource_id: id,
          metadata: { retailer_name: retailerInfo?.name || 'Unknown' }
        });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
}

function sanitizeRetailerData(data: any): RetailerData {
  return {
    id: data.id?.toString().slice(0, 50) || undefined,
    name: data.name?.toString().slice(0, 100) || '',
    logo_url: data.logo_url?.toString().slice(0, 500) || undefined,
    base_url: data.base_url?.toString().slice(0, 500) || '',
    affiliate_id: data.affiliate_id?.toString().slice(0, 100) || '',
    commission_rate: typeof data.commission_rate === 'number' ? 
      Math.max(0, Math.min(1, data.commission_rate)) : undefined,
    supports_api: typeof data.supports_api === 'boolean' ? data.supports_api : false,
    min_order_for_delivery: typeof data.min_order_for_delivery === 'number' ? 
      Math.max(0, data.min_order_for_delivery) : undefined,
    delivery_fee_cents: typeof data.delivery_fee_cents === 'number' ? 
      Math.max(0, data.delivery_fee_cents) : undefined,
  };
}