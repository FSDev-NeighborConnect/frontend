"use client"

import { useState } from "react"
import { X, Send, Calendar } from "lucide-react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import { useCsrf } from "../context/CsrfContext"
import { apiUrl } from  "../utils/apiUtil"

function CreatePostModal({ isOpen, onClose, postType = "general", onPostCreated }) {
  const { userId: contextUserId } = useUser()
  const { csrfToken } = useCsrf()
  const userId = contextUserId || localStorage.getItem("userId")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: [],
    status: "open",
        // For events
    date: "",
    startTime: "",
    endTime: "",
    streetAddress: "",
    eventImage: null,
  })
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newCategory, setNewCategory] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        eventImage: file,
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.category.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        category: [...formData.category, newCategory.trim()],
      })
      setNewCategory("")
    }
  }

  const removeCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      category: formData.category.filter((cat) => cat !== categoryToRemove),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!userId) {
        throw new Error("User ID not found. Please log in again.")
      }
      
      if (postType === "event") {
                // Event creation

        const eventFormData = new FormData()

                // Add all form fields to FormData
        eventFormData.append("title", formData.title)
        eventFormData.append("description", formData.description)
        eventFormData.append("date", formData.date)
        eventFormData.append("startTime", formData.startTime)
        eventFormData.append("endTime", formData.endTime)
        eventFormData.append("streetAddress", formData.streetAddress)

                // Add hobbies/categories as array
        formData.category.forEach((cat) => {
          eventFormData.append("hobbies", cat)
        })

        if (formData.eventImage) {
          eventFormData.append("eventImage", formData.eventImage)
        }

        const response = await axios.post(apiUrl("api/events"), eventFormData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": csrfToken,
          },
        })

        if (onPostCreated) {
          onPostCreated(response.data)
        }
      } else {
        const postData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
        }

        const response = await axios.post(apiUrl("api/posts/post"), postData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
        })

        if (onPostCreated) {
          onPostCreated(response.data)
        }
      }

      onClose()
    } catch (err) {
      console.error("Error creating post:", err)
      setError(err.response?.data?.message || "Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto dark:bg-white dark:text-gray-900">
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white dark:bg-white">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900">
            {postType === "event" ? "Create Event" : "Create Post"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm dark:bg-red-100 dark:border-red-300">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
              required
              minLength={5}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
              required
              minLength={10}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
              {postType === "event" ? "Event Categories" : "Post Categories"}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="ml-1 text-purple-600 hover:text-purple-900 dark:text-purple-800 dark:hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                placeholder="Add a category"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-2 bg-purple-700 text-white rounded-r-md hover:bg-purple-800 dark:bg-purple-800 dark:hover:bg-purple-900"
              >
                Add
              </button>
            </div>
          </div>

          {postType !== "event" && (
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          {postType === "event" && (
            <>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                  Street Address
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-white dark:text-gray-900 dark:border-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-900">
                  Event Image (Optional)
                </label>
                {imagePreview ? (
                  <div className="relative mb-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Event preview"
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("")
                        setFormData({ ...formData, eventImage: null })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 dark:bg-white dark:border-gray-300">
                    <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-700">Click to upload an image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center dark:bg-purple-800 dark:hover:bg-purple-900"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {postType === "event" ? "Create Event" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal