"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "../context/UserContext"
import { User, Mail, Phone, MapPin, Home, ImageIcon, X, Save, ArrowLeft, Plus, AlertCircle } from "lucide-react"
import "./userprofile.css"
import HobbiesModal from './NewUser/HobbiesModal'
import { apiUrl } from  "../utils/apiUtil"
import getCookie from "../utils/csrfUtil"


function EditProfile() {
  const navigate = useNavigate()
  const { userId: contextUserId } = useUser()
  const csrfToken = getCookie("csrfToken")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [showHobbiesModal, setShowHobbiesModal] = useState(false)

  // Get userId from context or localStorage
  const userId = contextUserId || localStorage.getItem("userId")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    postalCode: "",
    bio: "",
    hobbies: [],
  })

  // Image preview state
  const [avatarPreview, setAvatarPreview] = useState("")
  const [coverPreview, setCoverPreview] = useState("")
  const [newHobby, setNewHobby] = useState("")

  // Avatar and cover image files for upload
  const [avatarFile, setAvatarFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      setLoading(true)
      setApiError(null)

      try {
        if (!userId) {
          throw new Error("User ID not found. Please log in again.")
        }

        // Fetch user data from API with CSRF token
        const response = await axios.get(apiUrl(`api/users/user/${userId}`), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })

        const userData = response.data

        // Update form data with user data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          streetAddress: userData.streetAddress || "",
          postalCode: userData.postalCode || "",
          bio: userData.bio || "",
          hobbies: userData.hobbies || [],
        })

        // Set image previews
        setAvatarPreview(userData.avatar?.url || "")
        setCoverPreview(userData.cover?.url || "")
      } catch (err) {
        console.error("Error fetching user data:", err)
        setApiError("Failed to load user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    } else {
      setLoading(false)
      setApiError("User ID not found. Please log in again.")
    }
  }, [userId, csrfToken])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
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

  const removeHobby = (hobbyToRemove) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (formData.phone && !/^[0-9-+() ]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    setApiError(null)
    setSuccessMessage(null)

    try {
      if (!userId) {
        throw new Error("User ID not found. Please log in again.")
      }

      // Log the data being sent for debugging
      console.log("Sending user data:", formData)

      // Try multiple endpoints for updating user profile
      let profileUpdated = false

      try {
        // First try /api/users/update/:id
        await axios.put(apiUrl(`api/users/${userId}`), formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
        })
        console.log("User profile updated successfully with /api/users/:id endpoint")
        profileUpdated = true
      } catch (updateError) {
        console.error("Error with first update endpoint:", updateError)

        try {
          // Try alternative endpoint
          await axios.put(apiUrl(`api/users/update/${userId}`), formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
          })
          console.log("User profile updated successfully with /api/users/update endpoint")
          profileUpdated = true
        } catch (altUpdateError) {
          console.error("Error with second update endpoint:", altUpdateError)
          throw new Error("Failed to update profile information")
        }
      }

      // Handle avatar upload if changed
      if (avatarFile) {
        console.log("Uploading avatar file:", avatarFile.name)

        const avatarFormData = new FormData()
        avatarFormData.append("avatar", avatarFile)

        // Based on the backend code, the correct endpoint is /api/users/upload-avatar
        try {
          const avatarResponse = await axios.post(apiUrl(`api/users/upload-avatar`), avatarFormData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRF-Token": csrfToken,
            },
          })
          console.log("Avatar upload response:", avatarResponse.data)
        } catch (avatarError) {
          console.error("Error uploading avatar:", avatarError)
          throw new Error("Failed to upload avatar image")
        }
      }

      // Handle cover upload if changed
      if (coverFile) {
        console.log("Uploading cover file:", coverFile.name)

        const coverFormData = new FormData()
        coverFormData.append("cover", coverFile)

        // Based on the backend code, the correct endpoint is /api/users/upload-cover
        try {
          const coverResponse = await axios.post(apiUrl(`api/users/upload-cover`), coverFormData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRF-Token": csrfToken,
            },
          })
          console.log("Cover upload response:", coverResponse.data)
        } catch (coverError) {
          console.error("Error uploading cover:", coverError)
          throw new Error("Failed to upload cover image")
        }
      }

      // Show success message
      setSuccessMessage("Profile updated successfully!")

      // Reset file states
      setAvatarFile(null)
      setCoverFile(null)

      // Navigate back to profile page after successful save
      setTimeout(() => navigate("/profile"), 2000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setApiError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10 dark:bg-gray-900">
      <div className="bg-white shadow dark:bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-700 dark:hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Profile</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">Edit Profile</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start dark:bg-red-100 dark:border-red-300">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-900">{apiError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start dark:bg-green-100 dark:border-green-300">
            <div className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0">✓</div>
            <p className="text-green-700 dark:text-green-900">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-900">Profile Images</h2>
            <div className="relative h-[200px] bg-gray-200 rounded-lg overflow-hidden mb-6 dark:bg-gray-300">
              {coverPreview && (
                <img src={coverPreview || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label className="bg-white text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change Cover
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>
            </div>

            <div className="flex items-end mb-4">
              <div className="relative">
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 dark:bg-gray-300">
                  {avatarPreview && (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-700 text-white p-2 rounded-full cursor-pointer hover:bg-purple-800 dark:bg-purple-800 dark:hover:bg-purple-900">
                  <ImageIcon className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-500 dark:text-gray-700">
                  Upload a profile picture and cover photo to personalize your profile.
                  <br />
                  Recommended sizes: Profile 400x400px, Cover 1200x300px.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-white">
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-900">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-700">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-700">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-700">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Street Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Postal Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-white">
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-900">Bio & Interests</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                placeholder="Tell your neighbors about yourself..."
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-700">{formData.bio?.length || 0}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">Hobbies & Interests</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900"
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className="ml-1.5 text-purple-600 hover:text-purple-900 dark:text-purple-800 dark:hover:text-purple-900"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowHobbiesModal(true)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Select Hobbies
              </button>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-700">
                Add hobbies and interests to connect with neighbors who share similar passions.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center dark:bg-purple-800 dark:hover:bg-purple-900"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {showHobbiesModal && (
          <HobbiesModal
            selectedHobbies={formData.hobbies}
            toggleHobby={toggleHobby}
            onClose={() => setShowHobbiesModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default EditProfile
