// /app/(tabs)/channel/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const channels = [
  {
    id: 'nyt',
    title: 'New York Times',
    image: require('@/assets/channels/nyt.jpg'),
  },
  {
    id: 'cnn',
    title: 'CNN',
    image: require('@/assets/channels/cnn.jpg'),
  },
  {
    id: 'bbc-news',
    title: 'BBC News',
    image: require('@/assets/channels/bbc.jpg'),
  },
  {
    id: 'al-jazeera-english',
    title: 'Al Jazeera',
    image: require('@/assets/channels/aljazeera.jpg'),
  },
];

export default function ChannelScreen() {
  const router = useRouter();

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/channel/[id]',
              params: { id: item.id },
            })
          }
          style={{
            marginBottom: 16,
            borderRadius: 12,
            overflow: 'hidden',
            elevation: 3,
            backgroundColor: '#fff',
          }}
        >
          <Image
            source={item.image}
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              width: '100%',
              padding: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
