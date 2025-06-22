import { supabase } from '@/lib/supabase';
import { uploadImageToSupabase } from '@/utils/uploadImage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    avatar: '',
    bio: '',
    email: '',
    phone: '',
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
        setProfile({
          ...data,
          email: user.email || '',
          phone: user.phone || '',
        });
      } else {
        console.error('Fetch profile error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const publicUrl = await uploadImageToSupabase(asset.uri);
      if (publicUrl) {
        setProfile({ ...profile, avatar: publicUrl });
      }
    }
  };

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

    if (!profile.name || !profile.username || !profile.bio) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required',
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name,
      username: profile.username,
      avatar: profile.avatar,
      bio: profile.bio,
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>Edit Profile</Text>

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.pickText}>Pick Avatar</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Name"
          value={profile.name}
          onChangeText={(val) => setProfile({ ...profile, name: val })}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Username"
          value={profile.username}
          onChangeText={(val) => setProfile({ ...profile, username: val })}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Bio"
          value={profile.bio}
          onChangeText={(val) => setProfile({ ...profile, bio: val })}
          style={[styles.input, { height: 90 }]}
          multiline
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Email (read-only)"
          value={profile.email}
          editable={false}
          style={[styles.input, { backgroundColor: '#eee' }]}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Phone (read-only)"
          value={profile.phone}
          editable={false}
          style={[styles.input, { backgroundColor: '#eee' }]}
          placeholderTextColor="#555"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </TouchableOpacity>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    zIndex: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 32,
    color: '#111',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  pickText: {
    color: '#0077cc',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#0077cc',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    elevation: 5,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
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
    fontFamily: 'Georgia',
  },
});