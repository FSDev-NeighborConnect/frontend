import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { email, password } = formData

  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
  
    if (!trimmedEmail) {
      setError("Email is required")
      return false
    }
  
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setError("Please enter a valid email address")
      return false
    }
  
    if (!trimmedPassword) {
      setError("Password is required")
      return false
    }
  
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
  
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setError("")

    try {
      await axios.post("http://localhost:3000/api/auth/login", {
        email: email.trim(),
        password
      }, {
        withCredentials: true
      })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default Login