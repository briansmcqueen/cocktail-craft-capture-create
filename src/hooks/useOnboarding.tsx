import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export function useOnboarding(user: User | null) {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setLoading(false);
          return;
        }

        // Show profile setup if user doesn't have a username
        if (data && !data.username) {
          setShowProfileSetup(true);
        } 
        // If username exists but onboarding not completed, mark it complete
        // (the My Bar onboarding handles the rest)
        else if (data && !data.onboarding_completed) {
          await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('Error in checkOnboardingStatus:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const completeProfileSetup = async () => {
    setShowProfileSetup(false);
    
    // Mark onboarding as completed
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    
    // Navigate to My Bar so the My Bar onboarding triggers
    navigate('/mybar');
  };

  return {
    showProfileSetup,
    loading,
    completeProfileSetup,
  };
}
