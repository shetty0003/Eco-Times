import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    avatar: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        console.error('Fetch profile error:', error);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    setSaved(false);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'User not found',
        position: 'bottom',
      });
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
    });

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message,
        position: 'bottom',
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Profile updated 🎉',
        position: 'bottom',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Inputs */}
      <TextInput
        placeholder="Name"
        value={profile.name}
        onChangeText={(val) => setProfile({ ...profile, name: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={profile.username}
        onChangeText={(val) => setProfile({ ...profile, username: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Avatar URL"
        value={profile.avatar}
        onChangeText={(val) => setProfile({ ...profile, avatar: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Bio"
        value={profile.bio}
        onChangeText={(val) => setProfile({ ...profile, bio: val })}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={updateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Animated Success Banner */}
      {saved && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutUp}
          layout={Layout}
          style={styles.successBanner}
        >
          <Text style={styles.successText}>✅ Profile saved!</Text>
        </Animated.View>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successBanner: {
    marginTop: 20,
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 10,
  },
  successText: {
    color: '#15803d',
    fontSize: 14,
    textAlign: 'center',
  },
});