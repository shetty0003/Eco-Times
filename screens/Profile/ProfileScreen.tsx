import { supabase } from '@/lib/supabase';
import { DrawerParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Profile = {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
};

type Post = {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  image_url?: string;
  time: string;
  isVerified: boolean;
  likes: number;
  comments: number;
};

const tabs = ['Tweets', 'Media', 'Likes'];

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('Tweets');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) setProfile(data);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('time', { ascending: false });

    if (!error && data) {
      let filtered = data;
      if (activeTab === 'Media') filtered = data.filter((p) => !!p.image_url);
      else if (activeTab === 'Likes') filtered = data.filter((p) => p.likes > 0);
      setPosts(filtered);
    }
    setLoading(false);
  };

  const handleAvatarChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Permission needed');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfile((prev) => (prev ? { ...prev, avatar: uri } : null));
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    await fetchPosts();
    setRefreshing(false);
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.userRow}>
            <Text style={styles.usernamePost}>{item.username}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={14} color="#1DA1F2" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.handle}>{item.handle} · {item.time}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{item.comments} comments</Text>
        <Text style={styles.footerText}>{item.likes.toLocaleString()} likes</Text>
      </View>
    </View>
  );

  if (!profile) return <ActivityIndicator style={{ marginTop: 50 }} color="#1DA1F2" />;

  return (
    <SafeAreaView style={styles.safeareacolour}>
      <StatusBar style="light" backgroundColor="#000" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.ecoTimes}>𝔈𝔠𝔬-𝔗𝔦𝔪𝔢𝔰</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Image source={{ uri: profile.avatar }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              onPress={() => router.push('/EditProfile')}
              style={styles.editProfileButton}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.banner} />
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={handleAvatarChange}>
                <Image source={{ uri: profile.avatar }} style={styles.avatarBig} />
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.usernameProfile}>@{profile.username}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
              <View style={styles.followRow}>
                <TouchableOpacity onPress={() => router.push('/Profile/FollowersScreen')}>
                  <Text style={styles.followText}><Text style={styles.bold}>24</Text> Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Profile/FollowersScreen')}>
                  <Text style={styles.followText}><Text style={styles.bold}>16</Text> Following</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabRow}>
              {tabs.map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Edit Profile Button */}
      <TouchableOpacity
        style={styles.floatingEditButton}
        onPress={() => router.push('/EditProfile')}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareacolour: {
    backgroundColor: '#000',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#000',
  },
  ecoTimes: {
    flex: 1,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#fff',
  },
  menuIcon: { position: 'absolute', left: 10 },
  profileIcon: { position: 'absolute', right: 10 },
  profileImage: { width: 30, height: 30, borderRadius: 15 },
  banner: { height: 120, backgroundColor: '#222' },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 6,
  },
  avatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1DA1F2',
    padding: 5,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#fff' },
  usernameProfile: { fontSize: 16, color: '#aaa' },
  bio: { fontSize: 14, color: '#ccc', marginTop: 4 },
  followRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  editProfileButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: '#1DA1F2',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  followText: { fontSize: 14, color: '#ddd' },
  bold: { fontWeight: 'bold', color: '#fff' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  tabText: { fontSize: 14, color: '#999' },
  activeTab: {
    fontWeight: 'bold',
    color: '#fff',
    borderBottomWidth: 2,
    borderColor: '#fff',
  },
  post: { padding: 14, borderBottomWidth: 0.3, borderBottomColor: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  usernamePost: { fontWeight: 'bold', fontSize: 15, color: '#fff' },
  handle: { fontSize: 13, color: '#888' },
  content: { fontSize: 15, marginVertical: 6, color: '#eee' },
  postImage: { width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover', marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  footerText: { color: '#999', fontSize: 13 },
  floatingEditButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },
});
