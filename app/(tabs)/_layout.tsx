import React from 'react'
import {Image } from 'react-native'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (

<Tabs screenOptions={{
      headerTitleStyle: {fontWeight: "normal"},
      headerTitleAlign: "center",
      tabBarActiveTintColor: "#FE572F",
      tabBarInactiveTintColor: "#898D9E",
    }}>
<Tabs.Screen
        name="beranda"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Image source={require("../../assets/home.png")} style={{ width: size, height: size, tintColor: focused ? '#FE572F' : '#898D9E'}} />
          ), 
        }}
      />
   <Tabs.Screen
          name="NuTracker" 
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/NutrackerImg.png")} style={{ width: size, height: size, tintColor: focused ? '#FE572F' : '#898D9E' }} />
            ),
          }}
        />
   <Tabs.Screen
          name="NutriLens"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/NutriLensImg.png")} style={{ width: size, height: size, tintColor: focused ? '#FE572F' : '#898D9E'  }} />
            ),
          }}
        />
         <Tabs.Screen
          name="insight"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/insightImg.png")} style={{ width: size, height: size, tintColor: focused ? '#FE572F' : '#898D9E' }} />

            ),
          }}
        />
   <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/ProfileImg.png")}  style={{ width: size, height: size, tintColor: focused ? '#FE572F' : '#898D9E' }} />
            ),
          }}  
        />
</Tabs>
  )
}
export default TabLayout

