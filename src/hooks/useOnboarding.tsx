import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useOnboarding(user: User | null) {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

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
        // Show feature tour if username exists but onboarding not completed
        else if (data && !data.onboarding_completed) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error in checkOnboardingStatus:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const completeProfileSetup = () => {
    setShowProfileSetup(false);
    // After profile setup, show the feature tour
    setShowOnboarding(true);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        throw error;
      }

      setShowOnboarding(false);
    } catch (error) {
      console.error('Error in completeOnboarding:', error);
      throw error;
    }
  };

  const skipOnboarding = async () => {
    await completeOnboarding();
  };

  return {
    showProfileSetup,
    showOnboarding,
    loading,
    completeProfileSetup,
    completeOnboarding,
    skipOnboarding,
  };
}
