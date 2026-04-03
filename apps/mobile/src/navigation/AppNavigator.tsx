import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen }         from '@/screens/home';
import { LanguagesScreen }    from '@/screens/languages';
import { SectionListScreen }  from '@/screens/sections';
import { FlashcardScreen }    from '@/screens/study';
import { ProfileScreen }      from '@/screens/profile';

import type { RootStackParamList, TabParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, string> = {
  Home:    '🏠',
  Learn:   '📚',
  Profile: '👤',
};

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#151A24',
          borderTopColor: '#1E2636',
          borderTopWidth: 1,
          paddingTop: 6,
          height: 60,
        },
        tabBarActiveTintColor:   '#7C6AF6',
        tabBarInactiveTintColor: '#7B8199',
        tabBarLabel: route.name,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Learn"   component={LanguagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0E14' },
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen
          name="Sections"
          component={SectionListScreen}
          options={({ route }) => ({
            headerShown: true,
            headerTitle: route.params.languageName,
            headerStyle: { backgroundColor: '#0B0E14' },
            headerTintColor: '#E2E4EC',
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="Study"
          component={FlashcardScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
