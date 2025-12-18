import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (authUserId: string, authMeta?: any) => {
    try {
      console.log('Fetching user:', { authUserId, mobile: authMeta?.mobile_number });

      const result = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      console.log('User lookup by ID result:', result);

      if (result.data) {
        console.log('User found by ID:', result.data);
        setUser(result.data as User);
        return;
      }

      if (authMeta?.mobile_number) {
        console.log('Trying mobile lookup:', authMeta.mobile_number);
        const mobileResult = await supabase
          .from('users')
          .select('*')
          .eq('mobile_number', authMeta.mobile_number)
          .maybeSingle();

        console.log('User lookup by mobile result:', mobileResult);

        if (mobileResult.data) {
          console.log('User found by mobile:', mobileResult.data);
          setUser(mobileResult.data as User);
          return;
        }
      }

      console.warn('User not found in database after all attempts');
      setUser(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await fetchUser(session.user.id, session.user.user_metadata);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        fetchUser(session.user.id, session.user.user_metadata).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (session?.user?.id) {
          await fetchUser(session.user.id, session.user.user_metadata);
        } else {
          setUser(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
