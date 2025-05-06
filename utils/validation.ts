export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

    if(!/\d/.test(password)) {
        return {
        valid: false,
        message: "Password must contain at least one number.",
        };
    }

    return { valid: true };
};

export const validateUsername = (username: string): boolean => {
  return username.trim().length >= 2
}