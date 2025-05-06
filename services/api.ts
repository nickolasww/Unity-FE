const API_BASE_URL = "https://hackathon-uc.iyh.my.id/api/api/";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      // Handle error responses
      console.error("API Error Data:", JSON.stringify(data, null, 2));
      throw new Error(data.message || "Login failed");
    }

    const token = data.payload?.token;

    if (!token) {
      console.error("Token not found in the response data.");
      throw new Error("Authentication token not received");
    }

    return { token };

  } catch (error: any) {
    console.error("Error in loginUser:", error);
    throw new Error(error.message || "Login failed");
  }
};


export const registerUser = async (name: string, email: string, password: string, confirmPassword: string) => { 
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  try { 
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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


