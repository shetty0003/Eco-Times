import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  post: {
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
};

export default function PostCard({ post }: Props) {
  return (
    <View style={styles.post}>
      <View style={styles.row}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.userRow}>
            <Text style={styles.username}>{post.username}</Text>
            {post.isVerified && (
              <Ionicons name="checkmark-circle" size={14} color="#1DA1F2" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.handle}>{post.handle} · {post.time}</Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {post.image_url && <Image source={{ uri: post.image_url }} style={styles.postImage} />}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{post.comments} comments</Text>
        <Text style={styles.footerText}>{post.likes?.toLocaleString()} likes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
    padding: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
});
