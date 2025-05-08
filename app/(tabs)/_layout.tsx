import React from 'react'
import { View, Text, } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';


const TabLayout = () => {
  return (
<Tabs screenOptions={{
      headerTitleStyle: {fontWeight: "normal"},
      headerTitleAlign: "center",
    }}>
<Tabs.Screen
        name="beranda"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ), 
        }}
      />
   <Tabs.Screen
          name="NuTracker" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
   <Tabs.Screen
          name="NutriLens"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
         <Tabs.Screen
          name="insight"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
   <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}  
        />
</Tabs>
  )
}
export default TabLayout

