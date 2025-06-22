import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity } from 'react-native';

const sections = [
  'home',
  'world',
  'science',
  'technology',
  'health',
  'sports',
  'business',
  'arts',
  'fashion',
  'travel',
];

export default function NYTSectionScreen() {
  const router = useRouter();

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/channel/[id]',
              params: { id: 'nyt', section: item },
            })
          }
          style={{
            padding: 16,
            borderRadius: 10,
            backgroundColor: '#eee',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, textTransform: 'capitalize' }}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
