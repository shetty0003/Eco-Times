import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
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

const PAGE_SIZE = 10;
const NYT_API_KEY = 'OEA92XA5YZbf6s7kb9hxAGahEThRPD0U';
const NEWS_API_KEY = '99466bfaa3c54bf9b9052de985c0c0e9';

export default function ChannelNewsScreen() {
  const router = useRouter();
  const { id, section } = useLocalSearchParams();
  const isNYT = id === 'nyt';
  const nytSection = typeof section === 'string' ? section : 'home';

  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  console.log('Channel ID:', id);
console.log('Section:', section);


  const STORAGE_KEY = `channel_news_${id}_${nytSection}`;

  const fetchNYT = async () => {
    const res = await fetch(
      `https://api.nytimes.com/svc/topstories/v2/${nytSection}.json?api-key=${NYT_API_KEY}`
    );
    const data = await res.json();
    const articles = data.results.map((item: any) => ({
      title: item.title,
      url: item.url,
      urlToImage: item.multimedia?.length ? item.multimedia[0].url : null,
      description: item.abstract,
    }));
    return articles;
  };

  const fetchNewsAPI = async (pageNum: number) => {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=${NEWS_API_KEY}&pageSize=${PAGE_SIZE}&page=${pageNum}`
    );
    const data = await res.json();
    return data.articles.map((item: any) => ({
      title: item.title,
      url: item.url,
      urlToImage: item.urlToImage,
      description: item.description,
    }));
  };

  const fetchNews = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const articles = isNYT
        ? await fetchNYT()
        : await fetchNewsAPI(pageNum);

      const updatedNews = pageNum === 1 ? articles : [...news, ...articles];
      setNews(updatedNews);
      setHasMore(!isNYT && articles.length === PAGE_SIZE);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNews));
    } catch (error) {
      console.warn('Fetch failed. Trying cache...', error);
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) setNews(JSON.parse(cached));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id, section]);

  const handleRefresh = () => {
    setPage(1);
    fetchNews(1, true);
  };

  const handleLoadMore = () => {
    if (!isNYT && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const toggleBookmark = async (article: Article) => {
    const key = 'bookmarked_articles';
    const existing = await AsyncStorage.getItem(key);
    let saved: Article[] = existing ? JSON.parse(existing) : [];

    const isBookmarked = saved.find((a) => a.url === article.url);
    if (isBookmarked) {
      saved = saved.filter((a) => a.url !== article.url);
    } else {
      saved.push(article);
    }

    await AsyncStorage.setItem(key, JSON.stringify(saved));
  };

  const renderItem = ({ item }: { item: Article }) => (
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
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: '#555', marginTop: 8 }}>{item.description}</Text>
        <TouchableOpacity
          onPress={() => toggleBookmark(item)}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: '#007bff' }}>🔖 Save Article</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && news.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading news...</Text>
      </View>
    );
  }

  if (!loading && news.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, color: '#666' }}>No articles found in this section.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={news}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          !isNYT && hasMore ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" />
              <Text style={{ marginTop: 8 }}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
