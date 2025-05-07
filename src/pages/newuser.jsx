import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function NewUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    streetAddress: '',
    postalCode: '',
    phone: '',
    avatarUrl: '',
    bio: '',
    role: 'member',
    hobbies: []
  })

  const [error, setError] = useState('')
  const [showHobbiesModal, setShowHobbiesModal] = useState(false)
  const navigate = useNavigate()

  const hobbiesList = [
    'Gardening',
    'Painting',
    'Cooking',
    'Reading',
    'Cycling',
    'Photography'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleHobby = (hobby) => {
    setFormData(prev => {
      if (prev.hobbies.includes(hobby)) {
        return {
          ...prev,
          hobbies: prev.hobbies.filter(h => h !== hobby)
        }
      } else {
        return {
          ...prev,
          hobbies: [...prev.hobbies, hobby]
        }
      }
    })
  }

  const validateForm = () => {
    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedPassword = formData.password.trim()
    const trimmedConfirmPassword = formData.confirmPassword.trim()
    const trimmedAddress = formData.streetAddress.trim()
    const trimmedPostalCode = formData.postalCode.trim()
    const trimmedPhone = formData.phone.trim()

    if (!trimmedName) {
      setError("Full name is required")
      return false
    }

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

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (!trimmedAddress) {
      setError("Street address is required")
      return false
    }

    if (!trimmedPostalCode) {
      setError("Postal code is required")
      return false
    }

    if (!trimmedPhone) {
      setError("Phone number is required")
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
      const { confirmPassword, ...userData } = formData
      await axios.post("/api/register", userData, { withCredentials: true })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-roboto">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg">
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-roboto">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-roboto">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-roboto">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-roboto">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 font-roboto">
                    Street Address
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    placeholder="123 Main St"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 font-roboto">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    placeholder="A1B 2C3"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 font-roboto">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>
              </div>
            </div>
            
            {/* Section 3: Profile Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                Profile Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 font-roboto">
                    Avatar URL (optional)
                  </label>
                  <input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 font-roboto">
                    Short Bio (max 500 characters)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength="500"
                    className={`mt-1 ${inputStyle}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    Hobbies
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHobbiesModal(true)}
                    className="mt-1 w-full flex justify-between items-center px-3 py-2 bg-blue-50 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <span>
                      {formData.hobbies.length > 0 
                        ? formData.hobbies.join(', ') 
                        : "Select your hobbies"}
                    </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" viewBox="0 0 24 24" 
                    fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 font-roboto"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-roboto">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 font-roboto"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hobbies Modal */}
      {showHobbiesModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div 
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowHobbiesModal(false)}
              ></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="
              inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 
              text-left overflow-hidden shadow-xl transform transition-all 
              sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6
            ">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto">
                    Select Your Hobbies
                  </h3>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {hobbiesList.map(hobby => (
                        <div key={hobby} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`hobby-${hobby}`}
                              name="hobbies"
                              type="checkbox"
                              checked={formData.hobbies.includes(hobby)}
                              onChange={() => toggleHobby(hobby)}
                              className="
                                focus:ring-blue-500 h-4 w-4 text-blue-600
                                border-gray-300 rounded
                              "
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`hobby-${hobby}`} className="font-medium text-gray-700 font-roboto">
                              {hobby}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowHobbiesModal(false)}
                  className="
                    inline-flex justify-center w-full rounded-md border border-transparent
                    shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white
                    hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-blue-700 sm:text-sm font-roboto
                  "
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Styling for all of the input fields.
const inputStyle = `
  appearance-none block w-full px-3 py-2
  bg-blue-50 border border-gray-300 text-gray-800
  rounded-md shadow-sm placeholder-gray-500
  focus:outline-none focus:ring-blue-500 focus:border-blue-500
  sm:text-sm
`

export default NewUser