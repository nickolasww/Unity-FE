import { StatusBar } from 'expo-status-bar'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { router } from "expo-router"
import { loginUser } from '../../services/api' 
import { validateEmail, validatePassword } from '../../utils/validation' 
import { Link } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate the form
  const validateForm = (): boolean => {
    let isValid = true

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError("")
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || "Password is required.")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  // Handle login process
  const handleLogin = async () => {
    if (!validateForm()) return // Prevent login if form is invalid

    try {
      setIsSubmitting(true)
      const data = await loginUser(email, password) // Make the login API call

      // Check if token exists before storing it
      if (data && data.token) {
        await AsyncStorage.setItem('authToken', data.token)  // Save the token to AsyncStorage
        router.push("/home")  // Navigate to home screen after login
      } else {
        throw new Error("Authentication token not found.") // Handle case where token is missing
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Your email or password is incorrect.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.welcome}>Welcome Back!</Text>

        <View style={styles.form}>
          {/* Email Input */}
          <Text style={{ fontSize: 12, marginBottom: 5 }}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="xxxxxx@gmail.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              if (emailError) setEmailError("") // Reset email error on change
            }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password Input */}
          <Text style={{ fontSize: 12, marginBottom: 5 }}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Input Your Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              if (passwordError) setPasswordError("") // Reset password error on change
            }}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity
            style={styles.LoginButton}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            <Text style={styles.LoginButtonText}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Forget Password Link */}
          <TouchableOpacity style={styles.forgetPasswordContainer}>
            <Link href="/auth/forgotpassword">
              <Text style={styles.forgetPassword}>Forget Password?</Text>
            </Link>
          </TouchableOpacity>

          {/* Continue with Google Button */}
          <TouchableOpacity style={styles.LoginGoogleButton}>
            <Text style={styles.googlebutton}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text>You don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className='text-bold font-2xl text-white'>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e8",
  },
  welcome: {
    color: '#762727',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 20,
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  LoginButton: {
    backgroundColor: "#8b2331",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  LoginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgetPasswordContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  forgetPassword: {
    color: "#8b2331",
    textAlign: "center",
    fontWeight: "bold",
  },
  LoginGoogleButton: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  googlebutton: {
    textAlign: "center",
  },
  SignUp: {
    color: "#8b2331",
  },
})

export default Login
