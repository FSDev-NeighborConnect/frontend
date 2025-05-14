import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import HobbiesModal from '../NewUser/HobbiesModal.jsx'
import validateForm from '../NewUser/ValidateRegisterInputs.jsx'
import { useCsrf } from '../../context/CsrfContext.jsx'

function CreateUser() {
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
  const { csrfToken } = useCsrf()

  const showError = (message) => {
    setError(message)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errorMessage = validateForm(formData)

    if (errorMessage) {
      showError(errorMessage)
      return
    }

    setError("")

    try {
      const { confirmPassword, ...userData } = formData
      await axios.post("/api/admin/users/create", userData, { withCredentials: true, headers: { "X-CSRF-Token": csrfToken }})
      navigate("/admin/dashboard-users")
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-roboto">
          Admin create a new account
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
                    width="24" height="24" viewBox="0 0 24 24"
                    fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <input id="name" name="name" type="text" placeholder="John Doe"
                    value={formData.name} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-roboto">
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" placeholder="example@email.com"
                    value={formData.email} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-roboto">
                    Password
                  </label>
                  <input id="password" name="password" type="password" placeholder="Enter your password"
                  value={formData.password} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-roboto">
                    Confirm Password
                  </label>
                  <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password"
                  value={formData.confirmPassword} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
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
                  <input id="streetAddress" name="streetAddress" type="text" placeholder="123 Main St"
                  value={formData.streetAddress} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 font-roboto">
                    Postal Code
                  </label>
                  <input id="postalCode" name="postalCode" type="text" placeholder="A1B 2C3"
                    value={formData.postalCode} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 font-roboto">
                    Phone Number
                  </label>
                  <input id="phone" name="phone" type="text" placeholder="(123) 456-7890"
                  value={formData.phone} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>
              </div>
            </div>

            {/* Section 3: Profile Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                  Account Role
              </h3>
              <div className="flex space-x-6 pb-2 mb-4">
                  <label className="inline-flex items-center">
                  <input type="radio" name="role" value="member" checked={formData.role === "member"} onChange={handleChange} className="form-radio text-purple-600"/>
                  <span className="ml-2 text-gray-700 font-roboto">Member</span>
                  </label>
                  <label className="inline-flex items-center">
                  <input type="radio" name="role" value="admin" checked={formData.role === "admin"} onChange={handleChange} className="form-radio text-purple-600"/>
                  <span className="ml-2 text-gray-700 font-roboto">Admin</span>
                  </label>
              </div>

              <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                Profile Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 font-roboto">
                    Avatar URL (optional) {/* Might change to enable upload of image in the future. Need backend support for this first */}
                  </label>
                  <input id="avatarUrl" name="avatarUrl" type="text" placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl} onChange={handleChange} className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 font-roboto">
                    Short Bio (max 500 characters)(optional)
                  </label>
                  <textarea id="bio" name="bio" rows="3" placeholder="Tell us about yourself..."
                  value={formData.bio} onChange={handleChange} maxLength="500" className={`mt-1 ${inputStyle}`} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    Hobbies (optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHobbiesModal(true)}
                    className="mt-1 w-full flex justify-between items-center px-3 py-2 bg-purple-50 border border-gray-300 
                    text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    <span>
                      {formData.hobbies.length > 0 
                        ? formData.hobbies.join(', ') 
                        : "Select your hobbies"}
                    </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" viewBox="0 0 24 24" 
                    fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
                font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 font-roboto"
              >
                Create user
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hobbies Modal */}
      {showHobbiesModal && (
        <HobbiesModal
          selectedHobbies={formData.hobbies}
          toggleHobby={toggleHobby}
          onClose={() => setShowHobbiesModal(false)}
        />
      )}
    </div>
  )
}

// Styling for all of the input fields.
const inputStyle = `
  appearance-none block w-full px-3 py-2
  bg-purple-50 border border-gray-300 text-gray-800
  rounded-md shadow-sm placeholder-gray-500
  focus:outline-none focus:ring-purple-500 focus:border-purple-500
  sm:text-sm
`

export default CreateUser