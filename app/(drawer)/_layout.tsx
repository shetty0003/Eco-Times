import { useFonts } from 'expo-font';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerNavigator from '../(drawer)/DrawerNavigator';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
        translucent
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <DrawerNavigator />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});