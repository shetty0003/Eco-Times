// app/article/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { Button, Linking, Text, View } from 'react-native';

export default function ArticleDetails() {
  const { id, title, url } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ marginVertical: 8 }}>Article ID: {id}</Text>
      <Button title="Read Full Article" onPress={() => Linking.openURL(String(url))} />
    </View>
  );
}
