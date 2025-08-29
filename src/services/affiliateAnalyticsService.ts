import { supabase } from "@/integrations/supabase/client";

export interface ConversionEvent {
  id: string;
  shopping_session_id: string;
  order_id: string | null;
  actual_total_cents: number | null;
  commission_cents: number | null;
  conversion_date: string;
}

export interface SessionEvent {
  id: string;
  user_id: string | null;
  retailer_id: string;
  recipe_ids: string[];
  ingredient_ids: string[];
  estimated_total_cents: number | null;
  affiliate_url: string | null;
  status: 'pending' | 'completed' | 'abandoned';
  created_at: string;
  completed_at: string | null;
}

export interface AnalyticsMetrics {
  // Time-based metrics
  sessions_today: number;
  sessions_this_week: number;
  sessions_this_month: number;
  
  // Conversion metrics
  conversions_today: number;
  conversions_this_week: number;
  conversions_this_month: number;
  
  // Revenue metrics
  revenue_today: number;
  revenue_this_week: number;
  revenue_this_month: number;
  
  // Performance metrics
  conversion_rate_today: number;
  conversion_rate_this_week: number;
  conversion_rate_this_month: number;
  
  // Average order values
  aov_today: number;
  aov_this_week: number;
  aov_this_month: number;
}

export interface RetailerPerformance {
  retailer_id: string;
  retailer_name: string;
  total_sessions: number;
  total_conversions: number;
  total_revenue: number;
  conversion_rate: number;
  avg_order_value: number;
}

export interface PopularIngredient {
  ingredient_id: string;
  ingredient_name: string;
  purchase_count: number;
  revenue_generated: number;
}

// Track a click-through event
export async function trackClickThrough(
  shoppingSessionId: string,
  userId?: string
): Promise<boolean> {
  try {
    // Update session status to indicate user clicked through
    const { error } = await supabase
      .from('shopping_sessions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', shoppingSessionId);

    if (error) {
      console.error('Error tracking click-through:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error tracking click-through:', error);
    return false;
  }
}

// Get comprehensive analytics metrics
export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - (7 * 24 * 60 * 60 * 1000));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch sessions
    const { data: allSessions } = await supabase
      .from('shopping_sessions')
      .select('*');

    // Fetch conversions
    const { data: allConversions } = await supabase
      .from('affiliate_conversions')
      .select('*');

    if (!allSessions || !allConversions) {
      throw new Error('Failed to fetch analytics data');
    }

    // Calculate time-based metrics
    const sessionsToday = allSessions.filter(s => 
      new Date(s.created_at) >= todayStart
    ).length;
    
    const sessionsThisWeek = allSessions.filter(s => 
      new Date(s.created_at) >= weekStart
    ).length;
    
    const sessionsThisMonth = allSessions.filter(s => 
      new Date(s.created_at) >= monthStart
    ).length;

    const conversionsToday = allConversions.filter(c => 
      new Date(c.conversion_date) >= todayStart
    );
    
    const conversionsThisWeek = allConversions.filter(c => 
      new Date(c.conversion_date) >= weekStart
    );
    
    const conversionsThisMonth = allConversions.filter(c => 
      new Date(c.conversion_date) >= monthStart
    );

    // Calculate revenue
    const revenueToday = conversionsToday.reduce((sum, c) => 
      sum + (c.actual_total_cents || 0), 0
    );
    
    const revenueThisWeek = conversionsThisWeek.reduce((sum, c) => 
      sum + (c.actual_total_cents || 0), 0
    );
    
    const revenueThisMonth = conversionsThisMonth.reduce((sum, c) => 
      sum + (c.actual_total_cents || 0), 0
    );

    // Calculate conversion rates
    const conversionRateToday = sessionsToday > 0 ? (conversionsToday.length / sessionsToday) * 100 : 0;
    const conversionRateThisWeek = sessionsThisWeek > 0 ? (conversionsThisWeek.length / sessionsThisWeek) * 100 : 0;
    const conversionRateThisMonth = sessionsThisMonth > 0 ? (conversionsThisMonth.length / sessionsThisMonth) * 100 : 0;

    // Calculate average order values
    const aovToday = conversionsToday.length > 0 ? revenueToday / conversionsToday.length : 0;
    const aovThisWeek = conversionsThisWeek.length > 0 ? revenueThisWeek / conversionsThisWeek.length : 0;
    const aovThisMonth = conversionsThisMonth.length > 0 ? revenueThisMonth / conversionsThisMonth.length : 0;

    return {
      sessions_today: sessionsToday,
      sessions_this_week: sessionsThisWeek,
      sessions_this_month: sessionsThisMonth,
      
      conversions_today: conversionsToday.length,
      conversions_this_week: conversionsThisWeek.length,
      conversions_this_month: conversionsThisMonth.length,
      
      revenue_today: revenueToday,
      revenue_this_week: revenueThisWeek,
      revenue_this_month: revenueThisMonth,
      
      conversion_rate_today: conversionRateToday,
      conversion_rate_this_week: conversionRateThisWeek,
      conversion_rate_this_month: conversionRateThisMonth,
      
      aov_today: aovToday,
      aov_this_week: aovThisWeek,
      aov_this_month: aovThisMonth
    };
  } catch (error) {
    console.error('Error fetching analytics metrics:', error);
    return {
      sessions_today: 0,
      sessions_this_week: 0,
      sessions_this_month: 0,
      conversions_today: 0,
      conversions_this_week: 0,
      conversions_this_month: 0,
      revenue_today: 0,
      revenue_this_week: 0,
      revenue_this_month: 0,
      conversion_rate_today: 0,
      conversion_rate_this_week: 0,
      conversion_rate_this_month: 0,
      aov_today: 0,
      aov_this_week: 0,
      aov_this_month: 0
    };
  }
}

// Get retailer performance comparison
export async function getRetailerPerformance(): Promise<RetailerPerformance[]> {
  try {
    const { data: sessions } = await supabase
      .from('shopping_sessions')
      .select('retailer_id, estimated_total_cents');

    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select(`
        actual_total_cents,
        shopping_session_id,
        shopping_sessions!inner(retailer_id)
      `);

    const { data: retailers } = await supabase
      .from('retailers')
      .select('id, name');

    if (!sessions || !conversions || !retailers) {
      return [];
    }

    const performanceMap = new Map<string, {
      sessions: number;
      conversions: number;
      revenue: number;
    }>();

    // Count sessions by retailer
    sessions.forEach(session => {
      const current = performanceMap.get(session.retailer_id) || {
        sessions: 0,
        conversions: 0,
        revenue: 0
      };
      current.sessions++;
      performanceMap.set(session.retailer_id, current);
    });

    // Count conversions and revenue by retailer
    conversions.forEach(conversion => {
      const retailerId = (conversion.shopping_sessions as any).retailer_id;
      const current = performanceMap.get(retailerId) || {
        sessions: 0,
        conversions: 0,
        revenue: 0
      };
      current.conversions++;
      current.revenue += conversion.actual_total_cents || 0;
      performanceMap.set(retailerId, current);
    });

    // Build performance results
    return retailers.map(retailer => {
      const performance = performanceMap.get(retailer.id) || {
        sessions: 0,
        conversions: 0,
        revenue: 0
      };

      return {
        retailer_id: retailer.id,
        retailer_name: retailer.name,
        total_sessions: performance.sessions,
        total_conversions: performance.conversions,
        total_revenue: performance.revenue,
        conversion_rate: performance.sessions > 0 ? (performance.conversions / performance.sessions) * 100 : 0,
        avg_order_value: performance.conversions > 0 ? performance.revenue / performance.conversions : 0
      };
    }).filter(r => r.total_sessions > 0); // Only show retailers with activity
  } catch (error) {
    console.error('Error fetching retailer performance:', error);
    return [];
  }
}

// Get most popular ingredients being purchased
export async function getPopularIngredients(limit: number = 10): Promise<PopularIngredient[]> {
  try {
    const { data: sessions } = await supabase
      .from('shopping_sessions')
      .select('ingredient_ids');

    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select(`
        actual_total_cents,
        shopping_session_id,
        shopping_sessions!inner(ingredient_ids)
      `);

    if (!sessions || !conversions) {
      return [];
    }

    const ingredientMap = new Map<string, {
      count: number;
      revenue: number;
    }>();

    // Count ingredient appearances in sessions
    sessions.forEach(session => {
      if (session.ingredient_ids) {
        session.ingredient_ids.forEach((ingredientId: string) => {
          const current = ingredientMap.get(ingredientId) || { count: 0, revenue: 0 };
          current.count++;
          ingredientMap.set(ingredientId, current);
        });
      }
    });

    // Add revenue from conversions
    conversions.forEach(conversion => {
      const ingredientIds = (conversion.shopping_sessions as any).ingredient_ids;
      if (ingredientIds && conversion.actual_total_cents) {
        const revenuePerIngredient = conversion.actual_total_cents / ingredientIds.length;
        
        ingredientIds.forEach((ingredientId: string) => {
          const current = ingredientMap.get(ingredientId) || { count: 0, revenue: 0 };
          current.revenue += revenuePerIngredient;
          ingredientMap.set(ingredientId, current);
        });
      }
    });

    // Convert to array and sort by count
    const results = Array.from(ingredientMap.entries())
      .map(([ingredientId, data]) => ({
        ingredient_id: ingredientId,
        ingredient_name: ingredientId, // TODO: Resolve to actual ingredient name
        purchase_count: data.count,
        revenue_generated: data.revenue
      }))
      .sort((a, b) => b.purchase_count - a.purchase_count)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error('Error fetching popular ingredients:', error);
    return [];
  }
}

// Generate a comprehensive analytics report
export async function generateAnalyticsReport(): Promise<{
  metrics: AnalyticsMetrics;
  retailerPerformance: RetailerPerformance[];
  popularIngredients: PopularIngredient[];
}> {
  try {
    const [metrics, retailerPerformance, popularIngredients] = await Promise.all([
      getAnalyticsMetrics(),
      getRetailerPerformance(),
      getPopularIngredients()
    ]);

    return {
      metrics,
      retailerPerformance,
      popularIngredients
    };
  } catch (error) {
    console.error('Error generating analytics report:', error);
    return {
      metrics: {} as AnalyticsMetrics,
      retailerPerformance: [],
      popularIngredients: []
    };
  }
}