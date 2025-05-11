import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCsrf } from "../../context/CsrfContext"

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { email, password } = formData
  const { setCsrfToken } = useCsrf()

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

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }

    if (!/[a-zA-Z]/.test(trimmedPassword)) {
      setError("Password must contain at least one letter")
      return false
    }

    if (!/\d/.test(trimmedPassword)) {
      setError("Password must contain at least one number")
      return false
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword)) {
      setError("Password must contain at least one special character")
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
      const res = await axios.post(
        "/api/admin/login",
        { email: email.trim(), password },
        { withCredentials: true }
      )
      setCsrfToken(res.data.csrfToken) // Storing token in React state

      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-roboto">
          Admin Sign In
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500 stroke-red-500 font-roboto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 font-roboto"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className="
                    appearance-none block w-full px-3 py-2
                    bg-purple-50 border border-gray-300 text-gray-800
                    rounded-md shadow-sm placeholder-gray-500
                    focus:outline-none focus:ring-purple-500 focus:border-purple-500
                    sm:text-sm
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 font-roboto"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange}
                  className="
                    appearance-none block w-full px-3 py-2
                    bg-purple-50 border border-gray-300 text-gray-800
                    rounded-md shadow-sm placeholder-gray-500
                    focus:outline-none focus:ring-purple-500 focus:border-purple-500
                    sm:text-sm
                  "
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="
                  w-full flex justify-center py-2 px-4
                  border border-transparent rounded-md shadow-sm
                  text-sm font-medium text-white
                  bg-purple-700 hover:bg-purple-800
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600
                  font-roboto
                "
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
