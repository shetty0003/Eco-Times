import { supabase } from '@/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const glowScale = useSharedValue(1);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Required', 'Please enter both email and password.');
      return;
    }

    glowScale.value = withTiming(0.95, { duration: 150 });
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    glowScale.value = withSpring(1);
    setLoading(false);

    if (error) {
      Alert.alert('💥 Access Denied', error.message);
    } else {
      router.replace('/(drawer)/HomeStackNavigator');
    }
  };

  const glowingButton = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    shadowOpacity: glowScale.value,
  }));

  return (
    <ImageBackground
      source={require('../../assets/images/icon.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay} />

      <Animated.View style={styles.logoContainer} entering={ZoomIn.delay(200).duration(1000)}>
        <MaterialCommunityIcons name="post" size={60} color="#00ffe0" />
        <Text style={styles.logoText}>NeoVerse</Text>
      </Animated.View>

      <BlurView intensity={80} tint="dark" style={styles.card}>
        <Text style={styles.title}>Welcome Back, legend jaafar</Text>

        <Animated.View style={styles.form} entering={FadeInUp.duration(800)}>
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#00ffe0" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <MaterialCommunityIcons name="shield-lock-outline" size={18} color="#00ffe0" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Animated.View style={[styles.button, glowingButton]}>
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#00ffe0" />
              ) : (
                <Text style={styles.buttonText}>🔓 Engage</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.signUp}>Join the NeoVerse</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({


  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    backdropFilter: 'blur(10px)', // iOS only
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    color: '#eee',
  },
  login: {
    color: '#90cdf4',
    fontWeight: 'bold',
  },


 
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? 70 : 100,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    color: '#00ffe0',
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textShadowColor: '#0ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  
  
  form: {},
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0ff6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
 
  
  signUp: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 6,
  },
});

