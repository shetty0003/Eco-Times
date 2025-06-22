import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js'; // ✅ make sure you import this
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // ✅ fix here

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
};
