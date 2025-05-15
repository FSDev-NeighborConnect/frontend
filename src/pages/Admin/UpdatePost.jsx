import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useCsrf } from "../../context/CsrfContext.jsx"
import { apiUrl, apiConfigCsrf } from "../../utils/apiUtil.jsx"
import { AuthPageHeader } from "../AuthPageHeader.jsx"

export default function UpdatePost() {
  const { state } = useLocation()
  const { post } = state || {}  // Post data fetched from the dashboard
  const [formData, setFormData] = useState({
    title: post?.title || "",
    description: post?.description || "",
    status: post?.status || "open",
    category: post?.category || []
  })

  const { csrfToken } = useCsrf()
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const showError = (message) => {
    setError(message)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          category: [...prev.category, value]
        }
      } else {
        return {
          ...prev,
          category: prev.category.filter(cat => cat !== value)
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    try {
      const response = await axios.put(
        apiUrl(`api/admin/posts/${post._id}`),
        formData,
        apiConfigCsrf(csrfToken)
      )

      if (response.status === 200) {
        navigate("/admin/dashboard-posts")
      } else {
        showError("Failed to update post.")
      }
    } catch (err) {
      showError(err.response?.data?.message || "Update failed")
    }
  }

  // Define available categories
  const availableCategories = [
    'Community',
    'Environment',
    'Education',
    'Health',
    'Safety',
    'Infrastructure',
    'Events'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthPageHeader />
      <div className="flex flex-col justify-center sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-roboto">
            Update Post
          </h2>
          {post?.createdBy?.name && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Originally posted by: {post.createdBy.name}
            </p>
          )}
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
              {/* Section 1: Post Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                  Post Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 font-roboto">
                      Title
                    </label>
                    <input 
                      id="title" 
                      name="title" 
                      type="text" 
                      placeholder="Post title"
                      value={formData.title} 
                      onChange={handleChange} 
                      required
                      className={`mt-1 ${inputStyle}`} 
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 font-roboto">
                      Description
                    </label>
                    <textarea 
                      id="description" 
                      name="description" 
                      rows="4"
                      placeholder="Describe your post in detail..."
                      value={formData.description} 
                      onChange={handleChange} 
                      required
                      className={`mt-1 ${inputStyle}`} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-roboto">
                      Status
                    </label>
                    <div className="mt-1 space-y-2">
                      {['open', 'in progress', 'closed'].map((status) => (
                        <label key={status} className="inline-flex items-center mr-4">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={formData.status === status}
                            onChange={handleChange}
                            className="form-radio text-purple-600"
                            required
                          />
                          <span className="ml-2 text-gray-700 font-roboto capitalize">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-roboto">
                      Categories
                    </label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableCategories.map((category) => (
                        <label key={category} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value={category}
                            checked={formData.category.includes(category)}
                            onChange={handleCategoryChange}
                            className="form-checkbox text-purple-600"
                          />
                          <span className="ml-2 text-gray-700 font-roboto">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Location Information (Read-only) */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 font-roboto mb-4 pb-2 border-b border-gray-200">
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-roboto">
                      Street Address
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                      {post?.street || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-roboto">
                      Postal Code
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                      {post?.postalCode || "Not specified"}
                    </div>
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
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = `
  appearance-none block w-full px-3 py-2
  bg-purple-50 border border-gray-300 text-gray-800
  rounded-md shadow-sm placeholder-gray-500
  focus:outline-none focus:ring-purple-500 focus:border-purple-500
  sm:text-sm
`