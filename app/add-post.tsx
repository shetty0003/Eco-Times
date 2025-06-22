import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function AddPost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePost = async () => {
    if (content.trim().length === 0) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    setLoading(true);

    // Example: insert a new post into supabase 'posts' table
    const { data, error } = await supabase.from('posts').insert([
      {
        content,
        // Add other required fields here, e.g.:
        username: 'DemoUser',  // Replace with actual logged-in user info
        handle: '@demouser',
        avatar: 'https://i.pravatar.cc/150?img=12', // example avatar URL
        time: new Date().toISOString(),
        isVerified: false,
        likes: 0,
        comments: 0,
        tab: 'ForYou', // default tab
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Post created!');
      router.back(); // go back to posts feed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator color="#1DA1F2" size="large" />
      ) : (
        <Button title="Post" onPress={handlePost} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 22, marginBottom: 20 },
  input: {
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    padding: 12,
    height: 120,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});
