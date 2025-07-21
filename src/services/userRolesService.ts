import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'moderator' | 'user';

export const userRolesService = {
  async getUserRoles(userId?: string): Promise<UserRole[]> {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return [];
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', targetUserId);

    if (error) throw error;
    return data?.map(r => r.role as UserRole) || [];
  },

  async hasRole(role: UserRole, userId?: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(role);
  },

  async isAdmin(userId?: string): Promise<boolean> {
    return this.hasRole('admin', userId);
  }
};