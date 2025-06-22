// screens/AuthScreen.tsx
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AuthScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

 
 


  
  const handleAuth = async () => {
    setLoading(true);
    const { error, data } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      Alert.alert('Auth Error', error.message);
    } else {
      if (!isSignUp) {
        router.replace('/(tabs)'); // go to home screen or main layout
      } else {
        Alert.alert('Check your email to confirm your account');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Login'}</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title={loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'} onPress={handleAuth} />

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? Login' : 'No account? Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  switchText: {
    color: '#1DA1F2',
    marginTop: 16,
    textAlign: 'center',
  },
});
