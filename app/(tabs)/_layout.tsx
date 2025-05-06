import React from 'react'
import { View, Text, } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';


const TabLayout = () => {
  return (
<Tabs >
<Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: () => null,  // Menghilangkan label
        }}
      />
   <Tabs.Screen
          name="localconnect" 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,  // Menghilangkan label
          }}
        />
   {/* Smart Planner Tab */}
   <Tabs.Screen
          name="smartplanner"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null, 
          }}
        />
   <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,  
          }}  
        />
</Tabs>
  )
}
export default TabLayout

