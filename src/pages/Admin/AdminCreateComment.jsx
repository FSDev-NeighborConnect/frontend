import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useCsrf } from '../../context/CsrfContext.jsx'
import { apiUrl, apiConfigCsrf } from '../../utils/apiUtil.jsx'
import { AuthPageHeader } from "../AuthPageHeader.jsx"

const CreateComment = () => {
  const [formData, setFormData] = useState({
    content: ''
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { postId } = useParams()
  const navigate = useNavigate()
  const { csrfToken } = useCsrf()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const commentData = {
        content: formData.content,
        post: postId
      }

      const response = await axios.post(
        apiUrl(`api/posts/${postId}/comments`),
        commentData,
        apiConfigCsrf(csrfToken)
      )

      navigate(-1)
    } catch (err) {
      console.error("Error creating comment:", err)
      setError(err.response?.data?.message || "Failed to create comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthPageHeader />
      <div className="flex flex-col justify-center sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Comment
          </h2>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
            <div className="bg-white py-8 px-6 shadow-sm rounded-lg">
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500 stroke-red-500 font-roboto"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24"
                        fill="none" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Comment Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        className="mt-1 appearance-none block w-full px-3 py-2 bg-purple-50 border border-gray-300 text-gray-800 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        rows="4"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {isLoading ? 'Creating...' : 'Create Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateComment