// navigation/types.ts

// Define Stack Navigation Types
export type RootStackParamList = {
  Drawer: undefined;
  ProfileScreen: undefined;
  ArticleDetails: {
    url: string;
    title: string;
    articleId: string;
  };
};


// Define Drawer Navigation Types
export type DrawerParamList = {
  Drawer: undefined;  // Main drawer container
  Home: undefined;    // Home screen, no params
  Profile: undefined; // Profile screen
  Settings: undefined; // Settings screen
};