import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://de43-118-99-68-242.ngrok-free.app";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

    let data;
    try {
      // Mencoba untuk parse respons sebagai JSON
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Received non-JSON response from server");
    }

    // const data = await response.json();
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", JSON.stringify(data, null, 2));



    if (!response.ok) {
      // Handle error responses
      console.error("API Error Data:", JSON.stringify(data, null, 2));
      throw new Error(data.message || "Login failed");
    }

    const authtoken = data.users?.token

    if (!authtoken) {
      console.error("Token not found in the response data.");
      throw new Error("Authentication token not received");
    }

    await AsyncStorage.setItem("authToken", authtoken);

    return { authtoken };

  } catch (error: any) {
    console.error("Server sedang down atau tidak dapat diakses");
    throw new Error(error.message || "Login failed");
  }
};


export const registerUser = async (name: string, email: string, password: string, confirmPassword: string) => { 
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  try { 
    const response = await fetch(`${API_BASE_URL}/api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: name,         // Corrected to `full_name`
        email,
        password,
        confirm_password: confirmPassword, // Corrected to `confirm_password`
      }),
    });

    // Log the raw response for debugging
    const rawResponse = await response.text(); // Get the response as text first
    console.log("API Raw Response:", rawResponse); // Log the raw response here

    if (!response.ok) {
      // If the response is not OK, throw an error with the raw response message
      throw new Error(rawResponse || "Registration failed");
    }

    // Try parsing the response as JSON
    const data = JSON.parse(rawResponse);

    if (!data) {
      throw new Error("No data received from registration");
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Registration failed. Please try again.");
  }
}


