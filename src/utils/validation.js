export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateSignupForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else if (!/^[a-zA-Z0-9_-]{3,16}$/.test(data.username)) {
    errors.username = 'Username must be 3-16 characters and can contain letters, numbers, underscores and hyphens';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}; 