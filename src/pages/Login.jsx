import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      }, {
        withCredentials: true
      })
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default Login