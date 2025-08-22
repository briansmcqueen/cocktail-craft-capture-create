import { supabase } from "@/integrations/supabase/client";

export interface BarPreset {
  id: string;
  user_id: string;
  name: string;
  ingredient_ids: string[];
  created_at: string;
  updated_at: string;
}

export const barPresetsService = {
  async getUserPresets(userId: string): Promise<BarPreset[]> {
    const { data, error } = await supabase
      .from('user_bar_presets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching presets:', error);
      throw error;
    }

    return data || [];
  },

  async savePreset(userId: string, name: string, ingredientIds: string[]): Promise<BarPreset> {
    const { data, error } = await supabase
      .from('user_bar_presets')
      .insert({
        user_id: userId,
        name,
        ingredient_ids: ingredientIds
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving preset:', error);
      throw error;
    }

    return data;
  },

  async updatePreset(presetId: string, name: string, ingredientIds: string[]): Promise<BarPreset> {
    const { data, error } = await supabase
      .from('user_bar_presets')
      .update({
        name,
        ingredient_ids: ingredientIds,
        updated_at: new Date().toISOString()
      })
      .eq('id', presetId)
      .select()
      .single();

    if (error) {
      console.error('Error updating preset:', error);
      throw error;
    }

    return data;
  },

  async deletePreset(presetId: string): Promise<void> {
    const { error } = await supabase
      .from('user_bar_presets')
      .delete()
      .eq('id', presetId);

    if (error) {
      console.error('Error deleting preset:', error);
      throw error;
    }
  }
};