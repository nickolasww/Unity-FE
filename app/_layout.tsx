import { StyleSheet, View, Text, useColorScheme } from 'react-native'
import { Stack } from 'expo-router';
import {Colors} from "../constants/color"

const RootLayout = () => {
  const colorSchema = useColorScheme()
  const theme = Colors[colorSchema] ?? Colors.light 

  return (
    <Stack screenOptions={{
      headerStyle: {backgroundColor: theme.navBackground},
      headerTintColor: theme.title,
      headerTitleStyle: {fontWeight: "bold"},
      headerTitleAlign: "center",
    }}> 
      <Stack.Screen name="index" options={{title: "index" , headerShown: false}} />
      <Stack.Screen name="auth/login" options={{ title: "Login"}} />
      <Stack.Screen name="auth/register" options={{ title: "Sing Up"}} />
      <Stack.Screen name="auth/forgotpassword" options={{ title: "Forgot Password"}} />
      <Stack.Screen name="(tabs)" options={{title: "index" , headerShown: false}}/>
      <Stack.Screen name="smartinput" options={{headerShown: false}}/>
      <Stack.Screen name="smarthistory" options={{headerShown: false}}/>
      <Stack.Screen name="recommendation/alam" options={{headerShown: false}}/>
      <Stack.Screen name="Detail" options={{ title: "Detail",headerShown: false }} />
      <Stack.Screen name="booking" options={{ headerShown: false }} />
      <Stack.Screen name="booking-confirm" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout
