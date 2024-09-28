import React, { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: () => (
              <Text>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="Clima"
          options={{
            title: 'Clima',
            tabBarIcon: () => (
              <Text>❄</Text>
            ),
          }}
        />
       <Tabs.Screen
          name="Emergencia"
          options={{
            title: 'Emergencia',
            tabBarIcon: () => (
              <Text>👮‍♂️</Text>
            ),
          }}
        />
       <Tabs.Screen
          name="Contactos"
          options={{
            title: 'Contactos',
            tabBarIcon: () => (
              <Text>📒</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="About"
          options={{
            title: 'About',
            tabBarIcon: () => (
              <Text>❗</Text>
            ),
          }}
        />
      </Tabs>
      
      
      
  
  );
}
