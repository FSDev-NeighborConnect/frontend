import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useCsrf } from "../../context/CsrfContext.jsx"
// import PostDetailModal from "./PostDetailModal.jsx"

const AdminDashboardPosts = () => {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [groupByPostalCode, setGroupByPostalCode] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const { csrfToken } = useCsrf()
  const navigate = useNavigate()

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.get("/api/users/currentUser", {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken }
        })

        if (response.data.role === "admin") {
          setIsAdmin(true)
          fetchPosts() // Only fetch posts if admin
        } else {
          navigate("/admin/login")
        }
      } catch (error) {
        console.error("Admin verification failed:", error)
        navigate("/admin/login")
      }
    }

    verifyAdmin()
  }, [navigate, csrfToken])

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts/all/posts", {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken }
      })
      setPosts(response.data)
    } catch (err) {
      setError(err.response?.status === 403
        ? "Admin access required!"
        : "Error fetching posts!")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle post update
  const handleUpdate = (post) => {
    // navigate("/admin/update-post", { state: { post } })
  }

  // Handle post delete
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/admin/posts/${postId}`, {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken }
      })
      setPosts(posts.filter((post) => post._id !== postId))
    } catch (err) {
      alert("Failed to delete post!")
    }
  }

  // Group posts by postal code
  const groupedByPostalCode = posts.reduce((acc, post) => {
    const postal = post.postalCode || "Unknown"
    if (!acc[postal]) acc[postal] = []
    acc[postal].push(post)
    return acc
  }, {})

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
          <h1 className="text-3xl font-extrabold text-gray-900">Post Management</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
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
            onClick={fetchPosts}
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
          
          <button
            onClick={() => setGroupByPostalCode(prev => !prev)}
            className={`px-4 py-2 rounded ${groupByPostalCode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {groupByPostalCode ? "Unsort by Postal Code" : "Sort by Postal Code"}
          </button>
          <button
            onClick={() => navigate("/admin/create-post")}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + New Post
          </button>
        </div>

        <div className="overflow-hidden bg-gray-50 shadow sm:rounded-lg">
          {posts.length === 0 ? (
            <p className="text-gray-500 p-4">No posts found.</p>
          ) : groupByPostalCode ? (
            Object.entries(groupedByPostalCode).map(([postalCode, posts]) => (
              <div key={postalCode} className="mb-6">
                <h3 className="ml-6 text-lg font-semibold text-gray-700">Postal Code: {postalCode}</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {post.createdBy.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{post.postalCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex justify-center">
                            <button onClick={() => handleUpdate(post)} className="mr-4 text-blue-600 hover:text-blue-900">Update</button>
                            <button onClick={() => handleDelete(post._id)} className="mr-4 text-red-600 hover:text-red-900">Delete</button>
                            <button onClick={() => setSelectedPost(post)} className="mr-4 text-green-600 hover:text-green-900">View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {post.createdBy.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{post.postalCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center">
                        <button onClick={() => handleUpdate(post)} className="mr-4 text-blue-600 hover:text-blue-900">Update</button>
                        <button onClick={() => handleDelete(post._id)} className="mr-4 text-red-600 hover:text-red-900">Delete</button>
                        <button onClick={() => setSelectedPost(post)} className="mr-4 text-green-600 hover:text-green-900">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedPost && (
        //<PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        console.log("User info") // Temp until modal has been created
      )}
    </div>
  )
}

export default AdminDashboardPosts