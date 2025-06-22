import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const mockFollowers = [
  { id: '1', name: 'John Doe', username: 'johndoe' },
  { id: '2', name: 'Jane Smith', username: 'janesmith' },
];

export default function FollowersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Followers</Text>
      <FlatList
        data={mockFollowers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.follower}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.username}>@{item.username}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  follower: { marginBottom: 15 },
  name: { fontSize: 16, fontWeight: '600' },
  username: { fontSize: 14, color: 'gray' },
});
