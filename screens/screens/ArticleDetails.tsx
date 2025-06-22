import { RootStackParamList } from '@/navigation/types'; // Adjust path
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Button, Linking, ScrollView, StyleSheet, Text } from 'react-native';

type ArticleDetailsRouteProp = RouteProp<RootStackParamList, 'ArticleDetails'>;

export default function ArticleDetails() {
  const { params } = useRoute<ArticleDetailsRouteProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{params.title}</Text>
      <Text style={styles.articleId}>Article ID: {params.articleId}</Text>
      <Button title="Read Full Article" onPress={() => Linking.openURL(params.url)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  articleId: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
});
