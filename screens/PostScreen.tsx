import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  tab?: 'ForYou' | 'Following';
};

const PostScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'ForYou' | 'Following'>('ForYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('tab', selectedTab)
      .order('time', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedTab]);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{item.username}</Text>
          {item.isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={14}
              color="#1DA1F2"
              style={{ marginLeft: 4 }}
            />
          )}
          <Text style={styles.handle}>
            {' '}
            {item.handle} · {item.time}
          </Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{item.comments} comments</Text>
        <Text style={styles.footerText}>{item.likes?.toLocaleString()} likes</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>𝔈𝔠𝔬-𝔗𝔦𝔪𝔢𝔰</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Switch */}
      <View style={styles.switchTabs}>
        <TouchableOpacity onPress={() => setSelectedTab('ForYou')}>
          <Text style={[styles.tabText, selectedTab === 'ForYou' && styles.activeTab]}>
            For you
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Following')}>
          <Text style={[styles.tabText, selectedTab === 'Following' && styles.activeTab]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {loading ? (
        <ActivityIndicator color="#1DA1F2" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Floating + Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-post')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  switchTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#1DA1F2',
    paddingBottom: 6,
  },
  post: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  handle: { color: '#aaa', fontSize: 13 },
  content: { color: '#fff', fontSize: 15, marginTop: 6, marginBottom: 8 },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { color: '#aaa', fontSize: 13 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1DA1F2',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default PostScreen;
