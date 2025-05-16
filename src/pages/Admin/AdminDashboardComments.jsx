import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useCsrf } from "../../context/CsrfContext.jsx"
import { apiUrl, apiConfigCsrf } from "../../utils/apiUtil.jsx"

const AdminDashboardComments = () => {
  const [comments, setComments] = useState([])
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { postId } = useParams()
  const { csrfToken } = useCsrf()
  const navigate = useNavigate()

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.get(
          apiUrl("api/users/currentUser"),
          apiConfigCsrf(csrfToken)
        )

        if (response.data.role === "admin") {
          setIsAdmin(true)
          fetchComments() // Fetch comments for the specific post
        } else {
          navigate("/admin/login")
        }
      } catch (error) {
        console.error("Admin verification failed:", error)
        navigate("/admin/login")
      }
    }

    verifyAdmin()
  }, [navigate, csrfToken, postId])

  // Fetch comments for the specific post
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        apiUrl(`api/posts/${postId}/comments`),
        apiConfigCsrf(csrfToken)
      )
      setComments(response.data)
    } catch (err) {
      setError(err.response?.status === 403
        ? "Admin access required!"
        : "Error fetching comments!")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle comment delete
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(
        apiUrl(`api/admin/comments/${commentId}`),
        apiConfigCsrf(csrfToken)
      )
      setComments(comments.filter((comment) => comment._id !== commentId))
    } catch (err) {
      alert("Failed to delete comment!")
    }
  }

  // Loading state
  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-16 mt-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Comments for Post #{postId}</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
          >
            <svg 
              className="h-5 w-5 mr-4 text-color-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#000000" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 16l-6-6 6-6"/><path d="M20 21v-7a4 4 0 0 0-4-4H5"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

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

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={fetchComments}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <svg
              className="text-color-gray-800" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="none" stroke="#000000" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>

        <div className="overflow-hidden bg-gray-50 shadow sm:rounded-lg">
          {comments.length === 0 ? (
            <p className="text-gray-500 p-4">No comments found for this post.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comment.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {comment.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{comment.postalCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center">
                        <button onClick={() => handleDelete(comment._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardComments