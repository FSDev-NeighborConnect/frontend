const validateForm = (formData) => {
  const trimmedName = formData.name.trim()
  const trimmedEmail = formData.email.trim()
  const trimmedPassword = formData.password.trim()
  const trimmedConfirmPassword = formData.confirmPassword.trim()
  const trimmedAddress = formData.streetAddress.trim()
  const trimmedPostalCode = formData.postalCode.trim()
  const trimmedPhone = formData.phone.trim()

  // Validate name
  if (!trimmedName) {
    return "Full name is required"
  } else if (trimmedName.length < 4) {
    return "Name must be at least 4 characters"
  } else if (!/^[\p{L}\p{M} \-']+$/u.test(trimmedName)) {
    return "Name contains invalid characters"
  }

  // Validate email
  if (!trimmedEmail) {
    return "Email is required"
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    return "Please enter a valid email address"
  }

  // Validate password
  if (!trimmedPassword) {
    return "Password is required"
  } else if (trimmedPassword.length < 8) {
    return "Password must be at least 8 characters"
  } else if (!/[a-zA-Z]/.test(trimmedPassword)) {
    return "Password must contain at least one letter"
  } else if (!/\d/.test(trimmedPassword)) {
    return "Password must contain at least one number"
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword)) {
    return "Password must contain at least one special character"
  }

  // Validate confirm password
  if (trimmedPassword !== trimmedConfirmPassword) {
    return "Passwords do not match"
  }

  // Validate street address
  if (!trimmedAddress) {
    return "Street address is required"
  } else if (trimmedAddress.length < 5) {
    return "Address must be at least 5 characters"
  }

  // Validate postal code
  if (!trimmedPostalCode) {
    return "Postal code is required"
  }
  // Not validating format of postal code since different countries use different formats

  // Validate phone number
  if (!trimmedPhone) {
    return "Phone number is required"
  } else if (!/^[0-9-+() ]+$/.test(trimmedPhone)) {
    return "Please enter a valid phone number"
  }

  // If all validations pass
  return ""
}
  
export default validateForm