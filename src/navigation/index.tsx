import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { RootStackParamList, TabParamList } from './types';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AccountScreen from '../screens/AccountScreen';
import CreativeDetailScreen from '../screens/CreativeDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

const Tabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        height: Platform.select({ ios: 88, default: 64 }),
        paddingTop: 6,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<keyof TabParamList, string> = {
          HomeTab: 'home',
          BrowseTab: 'search',
          FavoritesTab: 'heart',
          AccountTab: 'person',
        };
        return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="BrowseTab" component={BrowseScreen} options={{ title: 'Browse' }} />
    <Tab.Screen name="FavoritesTab" component={FavoritesScreen} options={{ title: 'Favourites' }} />
    <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: 'Account' }} />
  </Tab.Navigator>
);

const RootNavigator: React.FC = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreativeDetail" component={CreativeDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Request Booking' }} />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ presentation: 'modal', title: 'Sign in' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
