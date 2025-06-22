import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'Tweets' | 'Media' | 'Likes';

const tabs: TabKey[] = ['Tweets', 'Media', 'Likes'];

const mockData: Record<TabKey, string[]> = {
  Tweets: ['Just launched Eco-Times!', 'Working on new features...'],
  Media: ['Check out my screenshot!'],
  Likes: ['Liked an article: React Native Tips'],
};

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('Tweets');

  return (
    <View>
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={mockData[activeTab]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
  },
});
