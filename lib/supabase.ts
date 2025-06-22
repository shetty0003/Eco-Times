// lib/supabase.ts#

// lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


const supabaseUrl = 'https://xwgqffimcpieoryckzog.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Z3FmZmltY3BpZW9yeWNrem9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODIzODYsImV4cCI6MjA2NTY1ODM4Nn0.Za8dRtdytnR6-UB_N9BvpAmB0z_jmq8pmBZ1LmGZnAs'



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
