import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomTabs from '../(drawer)/BottomTabs';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation, state } = props;
  const activeRouteName = state.routes[state.index].name;

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            alert('Logged out!');
            
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
          style={styles.profilePic}
        />
        <View style={styles.statusBadge} />
        <Text style={styles.profileName}>Ahmad Shettima</Text>
        <Text style={styles.profileEmail}>ahmad.shettima@example.com</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        {}
        <DrawerItem
          label="Main"
          icon={({ color, size }) => (
            <Ionicons name="apps-outline" size={size} color={color} />
          )}
          focused={activeRouteName === 'Main'}
          onPress={() => navigation.navigate('Main')}
          labelStyle={activeRouteName === 'Main' ? styles.activeLabel : styles.label}
          style={activeRouteName === 'Main' ? styles.activeItem : styles.item}
        />
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={26} color="#E74C3C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.6)',
        drawerStyle: {
          backgroundColor: '#121212',
          width: 280,
          shadowColor: '#000',
          shadowOpacity: 0.7,
          shadowRadius: 10,
          shadowOffset: { width: 5, height: 0 },
          elevation: 20,
        },
      }}
      initialRouteName="Main"
    >
      
      <Drawer.Screen name="Main" component={BottomTabs} />
      
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  profileHeader: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderBottomColor: '#2c2c2c',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    position: 'relative',
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#BB86FC',
    marginBottom: 14,
  },
  statusBadge: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#121212',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: '#bbb',
    letterSpacing: 0.5,
  },
  drawerScroll: {
    paddingTop: 20,
  },
  item: {
    borderRadius: 14,
    marginHorizontal: 14,
    marginVertical: 6,
  },
  activeItem: {
    borderRadius: 14,
    marginHorizontal: 14,
    marginVertical: 6,
    backgroundColor: '#3700B3',
  },
  label: {
    fontSize: 17,
    color: '#ddd',
    fontWeight: '600',
  },
  activeLabel: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '800',
  },
  logoutSection: {
    padding: 22,
    borderTopColor: '#2c2c2c',
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#E74C3C',
    fontWeight: 'bold',
    marginLeft: 14,
    fontSize: 17,
  },
});

export default DrawerNavigator;
