/*import { supabase } from '@/lib/supabase';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const { data, error } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session;

      console.log('Session:', data.session); // 👈 useful debug log

      if (!isLoggedIn && pathname !== '/login' && pathname !== '/sign-up') {
        router.replace('/login');
      } else if (isLoggedIn && (pathname === '/login' || pathname === '/sign-up')) {
        router.replace('/'); // or `/home` or `/main` if you use drawer/tabs
      }

      setCheckingAuth(false);
    };

    checkLogin();
  }, [pathname]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}*/

import { Slot } from 'expo-router';


export default function RootLayout() {
  return <Slot />;
}


/*
import Toast from 'react-native-toast-message';

export default function AppLayout() {
  return (
    
    
      <Toast />
  
  );
} */