"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, MapPin } from "lucide-react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import { useCsrf } from "../context/CsrfContext"
import { apiUrl } from "../utils/apiUtil"
import {apiConfigCsrf } from "../utils/apiUtil"

function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { userId } = useUser()
  const { csrfToken } = useCsrf()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    streetAddress: "",
    postalCode: "",
    hobbies: [],
  })
  const [hobbyInput, setHobbyInput] = useState("")

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        streetAddress: "",
        postalCode: "",
        hobbies: [],
      })
      setError(null)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()],
      }))
      setHobbyInput("")
    }
  }

  const removeHobby = (hobbyToRemove) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form data
      if (
        !formData.title ||
        !formData.description ||
        !formData.date ||
        !formData.startTime ||
        !formData.endTime ||
        !formData.streetAddress ||
        !formData.postalCode
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Format date and times for backend
      const eventDate = new Date(formData.date)

      // Parse start time
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number)
      const startTime = new Date(eventDate)
      startTime.setHours(startHours, startMinutes)

      // Parse end time
      const [endHours, endMinutes] = formData.endTime.split(":").map(Number)
      const endTime = new Date(eventDate)
      endTime.setHours(endHours, endMinutes)

      // Validate end time is after start time
      if (endTime <= startTime) {
        throw new Error("End time must be after start time")
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDate.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        streetAddress: formData.streetAddress,
        postalCode: formData.postalCode,
        hobbies: formData.hobbies,
        createdBy: userId,
      }

      const response = await axios.post(apiUrl("api/events/event"), eventData,
        apiConfigCsrf(csrfToken)
      )

      if (response.data) {
        onEventCreated(response.data)
        onClose()
      }
    } catch (err) {
      console.error("Error creating event:", err)
      setError(err.response?.data?.message || err.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date*
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Start Time*
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  End Time*
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Street Address*
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Postal Code*
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories/Hobbies</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHobby())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add a category"
                />
                <button
                  type="button"
                  onClick={addHobby}
                  className="px-4 py-2 bg-purple-700 text-white rounded-r-md hover:bg-purple-800"
                >
                  Add
                </button>
              </div>
              {formData.hobbies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => removeHobby(hobby)}
                        className="ml-1 text-purple-800 hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 flex items-center"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEventModal
