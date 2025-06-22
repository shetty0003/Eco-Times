import { DrawerParamList, RootStackParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StackNavigationProp } from '@react-navigation/stack';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const TopNewsScreen = () => {
  // reuse your current HomeScreen UI here (articles, categories, search, etc.)
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Top News</Text>
      {/* Your FlatList and news content here */}
    </View>
  );
};

const SavedScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>🔖 Saved Articles</Text>
  </View>
);

const TrendingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>🔥 Trending News</Text>
  </View>
);




type Article = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

const API_KEY = '99466bfaa3c54bf9b9052de985c0c0e9';
const PAGE_SIZE = 3;

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString(undefined, options);
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const ArticleCard = React.memo(({ article }: { article: Article }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  return (
    <TouchableOpacity
  onPress={() =>
  router.push({
    pathname: '/article/[id]',
    params: {
      id: article.source.id || 'N/A',
      url: article.url,
      title: article.title,
    },
  })
}

  
  style={styles.articleCard}
>
  {article.urlToImage ? (
    <Image source={{ uri: article.urlToImage }} style={styles.articleImage} />
  ) : (
    <View style={[styles.articleImage, { backgroundColor: '#ccc' }]}>
      <Text style={{ textAlign: 'center' }}>No Image Available</Text>
    </View>
  )}
  
  <Text style={styles.articleCategory}>{article.source.name || 'Unknown Source'}</Text>
  <Text style={styles.articleTitle} numberOfLines={2}>{article.title || 'No Title'}</Text>
  <Text style={styles.articleDate}>{formatDateTime(article.publishedAt)}</Text>
</TouchableOpacity>
  );
});

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (isLoadMore = false, isRefreshing = false) => {
    if (!isLoadMore && !isRefreshing) setLoading(true);
    try {
      let url = '';
      const currentPageSize = isLoadMore ? PAGE_SIZE : 3;

      if (searchText) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchText
        )}&page=${page}&pageSize=${currentPageSize}&apiKey=${API_KEY}`;
      } else if (category === 'trading' || category === 'islam'||category==='Nigerian' ) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          category
        )}&page=${page}&pageSize=${currentPageSize}&apiKey=${API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${currentPageSize}&apiKey=${API_KEY}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (json.status === 'ok') {
        setArticles(prev =>
          isLoadMore ? [...prev, ...json.articles] : json.articles
        );
        setTotalResults(json.totalResults);
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch news');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNews(false);
  }, [category, searchText]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(true);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && articles.length < totalResults) {
      setPage(prev => prev + 1);
    }
  };

  const onSearchSubmit = () => {
    setPage(1);
    fetchNews(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNews(false, true);
  };

  const categories = [
    'general',
    'trading',
    'islam',
    'Nigerian',
    'business',
    'technology',
    'sports',
    'health',
    'science',
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu-outline" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.ecoTimes}>𝔈𝔠𝔬-𝔗𝔦𝔪𝔢𝔰</Text>

        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#555"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onSearchSubmit}>
            <Ionicons name="search-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, cat === category && styles.categoryButtonActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ color: cat === category ? '#fff' : '#000', textTransform: 'capitalize' }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.date, { paddingHorizontal: 16 }]}>
        {new Date().toDateString().toUpperCase()}
      </Text>
      <Text style={[styles.title, { paddingHorizontal: 16 }]}>Top News</Text>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0077cc" style={{ marginTop: 20 }} />
      ) : articles.length === 0 ? (
        <Text style={{ paddingHorizontal: 16 }}>No news found.</Text>
      ) : null}

      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.url + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => <ArticleCard article={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0077cc']} />
        }
        ListFooterComponent={
          loading && page > 1 ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
  },
  menuIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  profileIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ecoTimes: {
    fontSize: 32,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
    letterSpacing: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Georgia',
    paddingVertical: 6,
    paddingRight: 8,
    color: '#000',
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 16,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#0077cc',
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#ccc',
  },
  articleCategory: {
    fontSize: 12,
    color: '#0077cc',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: '#000',
  },
  articleDate: {
    fontSize: 12,
    color: '#888',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});
