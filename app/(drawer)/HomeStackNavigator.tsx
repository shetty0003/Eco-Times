/*import ArticleDetails from '@/screens/ArticleDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DrawerNavigator from './DrawerNavigator';

export type HomeStackParamList = {
  HomeScreen: undefined;
  DrawerNavigator: undefined;
  ArticleDetails: { url: string; title: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (

        <Stack.Navigator initialRouteName="HomeScreen">

      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
   
      <Stack.Screen name="ArticleDetails" component={ArticleDetails} />


      
    </Stack.Navigator>
  );
}
*/
// RootNavigator.tsx
import ArticleDetails from '@/screens/ArticleDetails'; // Detail screen from Home
import PostScreen from '@/screens/PostScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BottomTabs from './BottomTabs';

export type HomeStackParamList = {
  Drawer: undefined;
  PostScreen :undefined;
  BottomTab :undefined;
  ArticleDetails: { };
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="BottomTab" screenOptions={{ headerShown: false }}>
    
      <Stack.Screen name='BottomTab' component={BottomTabs}/>
     
        <Stack.Screen name="PostScreen" component={PostScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ArticleDetails" component={ArticleDetails} />
    </Stack.Navigator>
  );
}
