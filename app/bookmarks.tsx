import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Article {
  title: string;
  url: string;
  urlToImage: string | null;
  description: string;
}

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  const loadBookmarks = async () => {
    const data = await AsyncStorage.getItem('bookmarked_articles');
    if (data) setBookmarks(JSON.parse(data));
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => Linking.openURL(item.url)}
          style={{
            marginBottom: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            overflow: 'hidden',
            elevation: 2,
          }}
        >
          {item.urlToImage && (
            <Image
              source={{ uri: item.urlToImage }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          )}
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {item.title}
            </Text>
            <Text style={{ color: '#555', marginTop: 8 }}>
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text>No saved articles yet.</Text>
        </View>
      }
    />
  );
}
