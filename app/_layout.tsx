import { StyleSheet, View, Text, useColorScheme } from 'react-native'
import { Stack } from 'expo-router';
import {Colors} from "../constants/color"
import "../global.css"
import ResepKuDetail from './nutrilens/resepkuDetail';

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
      <Stack.Screen name="auth/login" options={{ title: "Login"  , headerShown: false}} />
      <Stack.Screen name="auth/register" options={{ title: "Sing Up"  , headerShown: false}} />
      <Stack.Screen name="(tabs)" options={{title: "index" , headerShown: false}}/>
      <Stack.Screen name="(tabs)/nutrilens" options={{title: "NutriLens"}} />
      <Stack.Screen name="nutrilens/resepkuDetail"  options={{title: "ResepKu"}} />
      <Stack.Screen name="personalisasi/personalisasipage"  options={{title: "Personalisasi"}} />
      <Stack.Screen name="insight/komunitasdetaillist"  options={{title: "Komunitas"}} />
      <Stack.Screen name="insight/komunitaslist"  options={{title: "Komunitas"}} />
      <Stack.Screen name="insight/artikeldetaillist"  options={{title: "Artikel"}} />
    </Stack>
  )
}

export default RootLayout
