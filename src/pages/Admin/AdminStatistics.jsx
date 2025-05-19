import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCsrf } from "../../context/CsrfContext.jsx"
import { apiUrl, apiConfigCsrf } from "../../utils/apiUtil.jsx"

const DashboardStatistics = () => {
  const [stats, setStats] = useState({
    neighborhoodData: {},
    statusCounts: {},
    userRoles: {},
    totalComments: 0,
    avgCommentsPerPost: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { csrfToken } = useCsrf()
  const navigate = useNavigate()

  const fetchStatistics = async () => {
    try {
      const [postsRes, usersRes, eventsRes, commentsRes] = await Promise.all([
        axios.get(apiUrl("api/admin/all/posts"), apiConfigCsrf(csrfToken)),
        axios.get(apiUrl("api/admin/all/users"), apiConfigCsrf(csrfToken)),
        axios.get(apiUrl("api/admin/all/events"), apiConfigCsrf(csrfToken)),
        axios.get(apiUrl("api/admin/all/comments"), apiConfigCsrf(csrfToken))
      ])

      const posts = postsRes.data
      const users = usersRes.data
      const events = eventsRes.data
      const comments = commentsRes.data

      const neighborhoodData = getNeighborhoodData(posts, users, events)
      const statusCounts = getStatusCounts(posts)
      const userRoles = getUserRoleCounts(users)
      const totalComments = comments.length
      const avgCommentsPerPost = posts.length > 0 
        ? totalComments / posts.length 
        : 0

      setStats({
        neighborhoodData,
        statusCounts,
        userRoles,
        totalComments,
        avgCommentsPerPost
      })
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load statistics")
      console.error("Statistics error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNeighborhoodData = (posts, users, events) => {
    const neighborhoodData = {}
    
    const updateData = (data, key) => {
      data.forEach(item => {
        const zip = item.postalCode || "Unknown"
        if (!neighborhoodData[zip]) {
          neighborhoodData[zip] = { posts: 0, users: 0, events: 0 }
        }
        neighborhoodData[zip][key] += 1
      })
    }

    updateData(posts, "posts")
    updateData(users, "users")
    updateData(events, "events")

    return neighborhoodData
  }

  const getStatusCounts = (posts) => 
    posts.reduce((acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1
      return acc
    }, {})

  const getUserRoleCounts = (users) =>
    users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})

  useEffect(() => {
    fetchStatistics()
  }, [csrfToken])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-16 mt-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Statistics</h1>
          <div className="flex space-x-4">
            <button
              onClick={fetchStatistics}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              title="Refresh statistics"
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
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
            >
              <svg 
                className="h-5 w-5 mr-2 text-color-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="#000000" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 16l-6-6 6-6"/><path d="M20 21v-7a4 4 0 0 0-4-4H5"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 stroke-red-500"
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

        {/* Post Status and User Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Post Status */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Post Status</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <tr key={status}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">User Roles</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.userRoles).map(([role, count]) => (
                    <tr key={role}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {Object.values(stats.userRoles).reduce((a, b) => a + b, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Comments Statistics */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Comments Statistics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Comments
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.totalComments}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Comments per Post
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.avgCommentsPerPost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Neighborhood Statistics */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Neighborhood Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Postal Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Posts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Events
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.neighborhoodData).map(([zip, data]) => (
                  <tr key={`neighborhood-${zip}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {zip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.users}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.posts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.events}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStatistics