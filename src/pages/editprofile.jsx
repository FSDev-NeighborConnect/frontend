"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, MapPin, Home, Image, X, Save, ArrowLeft, Plus, Trash2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import "./userprofile.css"

function EditProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    postalCode: "",
    bio: "",
    hobbies: [],
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePrivacy: "public",
    emailNotifications: true,
  })

  // Image preview state
  const [avatarPreview, setAvatarPreview] = useState("")
  const [coverPreview, setCoverPreview] = useState("")
  const [newHobby, setNewHobby] = useState("")

  // Mock user data - in a real app, this would come from your API
  const mockUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    streetAddress: "123 Maple Street",
    postalCode: "90210",
    phone: "123-456-7890",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    coverUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&h=300&auto=format&fit=crop",
    bio: "Friendly neighbor who loves gardening and community events. Always looking to connect with people who share similar interests in our neighborhood.",
    hobbies: ["Gardening", "Cooking", "Reading", "Photography", "Hiking"],
    profilePrivacy: "public",
    emailNotifications: true,
  }

  useEffect(() => {
    // Simulate loading user data from API
    setTimeout(() => {
      setFormData({
        ...mockUser,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setAvatarPreview(mockUser.avatarUrl)
      setCoverPreview(mockUser.coverUrl)
      setLoading(false)
    }, 500)
  }, [])

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
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, newHobby.trim()],
      })
      setNewHobby("")
    }
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
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
     newErrors.email = "Email is invalid"

    if (formData.phone && !/^[0-9-+() ]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid"
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters"
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to set a new password"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)

    // Simulate API call to save profile
    setTimeout(() => {
      setSaving(false)
      // Navigate back to profile page after successful save
      navigate("/profile")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Profile</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Cover Photo Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Profile Images</h2>
            <div className="relative h-[200px] bg-gray-200 rounded-lg overflow-hidden mb-6">
              {coverPreview && (
                <img src={coverPreview || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label className="bg-white text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Change Cover
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>
            </div>

            <div className="flex items-end mb-4">
              <div className="relative">
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
                  {avatarPreview && (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-700 text-white p-2 rounded-full cursor-pointer hover:bg-purple-800">
                  <Image className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-500">
                  Upload a profile picture and cover photo to personalize your profile.
                  <br />
                  Recommended sizes: Profile 400x400px, Cover 1200x300px.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Interests */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Bio & Interests</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                placeholder="Tell your neighbors about yourself..."
              />
              <p className="mt-1 text-sm text-gray-500">{formData.bio.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies & Interests</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => removeHobby(hobby)}
                      className="ml-1.5 text-purple-600 hover:text-purple-900"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50 bg-purple-50"
                  placeholder="Add a hobby or interest"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHobby())}
                />
                <button
                  type="button"
                  onClick={addHobby}
                  className="px-4 py-2 bg-purple-700 text-white rounded-r-md hover:bg-purple-800 flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add hobbies and interests to connect with neighbors who share similar passions.
              </p>
            </div>
          </div>

          {/* Password & Security */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Password & Security</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      errors.currentPassword ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                    placeholder="Enter to change password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-purple-50`}
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Privacy & Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Privacy & Notifications</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Privacy</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="privacy-public"
                      name="profilePrivacy"
                      type="radio"
                      value="public"
                      checked={formData.profilePrivacy === "public"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <label htmlFor="privacy-public" className="ml-3 block text-sm text-gray-700">
                      Public - Anyone in your neighborhood can see your profile
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="privacy-neighbors"
                      name="profilePrivacy"
                      type="radio"
                      value="neighbors"
                      checked={formData.profilePrivacy === "neighbors"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <label htmlFor="privacy-neighbors" className="ml-3 block text-sm text-gray-700">
                      Neighbors Only - Only connected neighbors can see your profile
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="privacy-private"
                      name="profilePrivacy"
                      type="radio"
                      value="private"
                      checked={formData.profilePrivacy === "private"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <label htmlFor="privacy-private" className="ml-3 block text-sm text-gray-700">
                      Private - Only you can see your profile details
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-gray-500">
                    Receive email notifications about new messages, event invitations, and neighborhood updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-red-200">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h2>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Deactivate Account</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Deactivating your account will remove your profile from the neighborhood network. You can reactivate
                    your account at any time by logging back in.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
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
      </div>
    </div>
  )
}

export default EditProfile
