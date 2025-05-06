import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native"
import { router } from "expo-router"
import { registerUser } from "../../services/api"
import { validateEmail, validatePassword } from "../../utils/validation"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from "expo-router"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const validateForm = (): boolean => {
    let isValid = true

    // Validate name
    if (!name) {
      Alert.alert("Please enter your name.")
      isValid = false
    }

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

    // Validate confirmPassword
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
      isValid = false
    } else {
      setConfirmPasswordError("")
    }

    return isValid
  }

  // Handle registration process
  const handleRegister = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const data = await registerUser(name, email, password, confirmPassword)

      // Check if token exists before storing it
      if (data && data.token) {
        await AsyncStorage.setItem('authToken', data.token)
        router.push("/home")
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Welcome to NusaTrip</Text>

      <View style={styles.form}>
        {/* Name Input */}
        <Text style={{ fontSize: 12, marginBottom: 5 }}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="input your first name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* Email Input */}
        <Text style={{ fontSize: 12, marginBottom: 5 }}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="xxxxxx@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <Text style={{ fontSize: 12, marginBottom: 5 }}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Input your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {/* Confirm Password Input */}
        <Text style={{ fontSize: 12, marginBottom: 5 }}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Input confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        {/* Register Button */}
        <TouchableOpacity style={styles.LoginButton} onPress={handleRegister} disabled={isSubmitting}>
          <Text style={styles.LoginButtonText}>
            {isSubmitting ? "Registering..." : "Sign up"}
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
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Text style={styles.googlebutton}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text>You don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.SignUp}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e8",
  },
  welcome: {
    color: "#762727",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
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
    justifyContent: "center",
  },
  SignUp: {
    color: "#8b2331",
  },
})

export default Register
