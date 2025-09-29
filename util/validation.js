
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

// export const isValidPassword = (password) => {
//     const trimmed = password.trim();
//     const minLength = trimmed.length >= 6;
//     const hasUppercase = /[A-Z]/.test(trimmed);
//     const hasLowercase = /[a-z]/.test(trimmed);
//     const hasNumber = /\d/.test(trimmed);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed);

//     return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
// };

export const isPasswordValid = (password) => {
    const trimmed = password.trim();

    if (trimmed.length < 6) return 'Password must be at least 6 characters.';
    if (!/[A-Z]/.test(trimmed)) return 'Password must include at least one uppercase letter.';
    //if (!/[a-z]/.test(trimmed)) return 'Password must include at least one lowercase letter.';
    if (!/\d/.test(trimmed)) return 'Password must include at least one number.';
    //if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed)) return 'Password must include at least one special character.';

    return null;
};

export const isValidPhone = (phone) => {
  const trimmed = phone.trim();
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(trimmed);
};

