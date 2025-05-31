import { StyleSheet, View, Text, useColorScheme } from 'react-native'
import { Stack } from 'expo-router';
import {Colors} from "../constants/color"
import "../global.css"

const RootLayout = () => {
  const colorSchema = useColorScheme()
  const theme = Colors[colorSchema] ?? Colors.light 

  return (
    <Stack screenOptions={{
      headerStyle: {backgroundColor: theme.navBackground},
      headerTintColor: theme.title,
      headerTitleStyle: {fontWeight: "semibold", fontSize: 18},
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
      <Stack.Screen name="insight/artikellist"  options={{title: "Artikel"}} />
      <Stack.Screen name="insight/beranda"  options={{title: "Beranda" ,headerShown: false}} />
      <Stack.Screen name="beranda/poin"  options={{title: "Voucher"}} />
      <Stack.Screen name="konsultasi/konsultasipage"  options={{title: "Konsultasi" ,headerShown: false}} />
      <Stack.Screen name="konsultasi/konsultasidetailpage"  options={{title: "Detail Konsultan" ,headerShown: false}} />
      <Stack.Screen name="konsultasi/verifikasiemailpage"  options={{title: "Verifikasi Email"}} />
      <Stack.Screen name="konsultasi/detailreservasi"  options={{title: "Detail Reservasi"}} />
      <Stack.Screen name="konsultasi/reservasiresult"  options={{title: "Reservasi"}} />
    </Stack>
  )
}

export default RootLayout
