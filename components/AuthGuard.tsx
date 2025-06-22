// components/AuthGuard.tsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/(auth)/login'); // redirect if not authenticated
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#1DA1F2" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
