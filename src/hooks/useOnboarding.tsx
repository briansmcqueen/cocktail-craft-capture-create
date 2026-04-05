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

    // Quick check: if we already cached that onboarding is complete, skip the query
    const cachedComplete = localStorage.getItem(`barbook_onboarding_complete_${user.id}`);
    if (cachedComplete === 'true') {
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
        } else if (data?.username) {
          // Cache the result so we don't query again
          localStorage.setItem(`barbook_onboarding_complete_${user.id}`, 'true');
          
          // If username exists but onboarding not completed, mark it complete
          if (!data.onboarding_completed) {
            await supabase
              .from('profiles')
              .update({ onboarding_completed: true })
              .eq('id', user.id);
          }
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
    
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      
      // Cache completion
      localStorage.setItem(`barbook_onboarding_complete_${user.id}`, 'true');
    }
    
    // Small delay before navigation for smoother transition
    setTimeout(() => navigate('/mybar'), 300);
  };

  return {
    showProfileSetup,
    loading,
    completeProfileSetup,
  };
}
