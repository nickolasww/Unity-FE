import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from "react-native";

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
    <SafeAreaView>
      <View style={styles.HeaderContainer}>
        <Text style={styles.Header}>Forgot your password? </Text>
        <Text style= {styles.HeaderParagraph}>
          Enter your registered email below to get password reset instructions
        </Text>
      </View>

      <View style={styles.form}> 
      <Text>Email</Text>
      <TextInput style={styles.input}
        placeholder="Input Your Password"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.SendButton}>
        <Text style={styles.SendButtonText}>Send</Text>
      </TouchableOpacity>
      </View> 

      <View style= {{ flexDirection: "row", justifyContent: "center", paddingTop: 20,}}>
        <Text>You remember your password? </Text>
        <TouchableOpacity>
          <Text style={{color: "#8b2331", fontWeight: "bold"}}>Login</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: "#f5f0e8",
    },
    HeaderContainer: { 
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    Header: { 
        fontSize: 24, 
        fontWeight: "bold",
    },
    HeaderParagraph: {
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 30,
        color: "#999",
        paddingTop: 10, 
        paddingBottom: 20, 
        fontWeight: "semibold",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 7,
        marginBottom: 20,
      },
    form: { 
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    SendButton: { 
        backgroundColor: "#8b2331",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
    },
    SendButtonText: { 
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14, 
    }, 
});
