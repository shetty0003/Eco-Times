import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DarkModeToggle from './DarkModeToggle';
import ProfileTabs from './ProfileTabs';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner} />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100x100.png?text=Avatar' }}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/EditProfile')}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>Ahmad Shettima</Text>
        <Text style={styles.username}>@ahmad</Text>
        <Text style={styles.bio}>Building Eco-Times 🚀</Text>

        <View style={styles.followRow}>
          <TouchableOpacity onPress={() => router.push('/Profile/FollowersScreen')}>
            <Text style={styles.followText}><Text style={styles.bold}>24</Text> Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Profile/FollowersScreen')}>
            <Text style={styles.followText}><Text style={styles.bold}>16</Text> Following</Text>
          </TouchableOpacity>
        </View>

        <DarkModeToggle />
      </View>

      <ProfileTabs />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { height: 120, backgroundColor: '#ddd' },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -40,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff',
  },
  editButton: {
    borderWidth: 1, borderColor: '#000', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
  },
  editText: { fontSize: 14, fontWeight: '600' },
  info: { paddingHorizontal: 20, marginTop: 10 },
  name: { fontSize: 22, fontWeight: 'bold' },
  username: { fontSize: 16, color: 'gray' },
  bio: { fontSize: 14, marginVertical: 10 },
  followRow: { flexDirection: 'row', gap: 20 },
  followText: { fontSize: 14, color: 'gray' },
  bold: { fontWeight: 'bold', color: '#000' },
});
