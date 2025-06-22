// app/BottomTabs.tsx

import Post from '@/screens/PostScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { default as ChannelsScreen } from '../(tabs)/channels';
import HomeScreen from '../home';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0077cc',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'For You') iconName = 'home-outline';
          else if (route.name === 'Channels') iconName = 'grid-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          else if (route.name == 'Post') iconName = 'add-circle-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />
;
        },
      })}
    >
      <Tab.Screen name="For You" component={HomeScreen} />
      <Tab.Screen name="Channels" component={ChannelsScreen} />
      <Tab.Screen name='Post' component={Post} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      
    </Tab.Navigator>
  );
};

export default BottomTabs;
