"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // Change from next/navigation to react-router-dom
import axios from "axios"
import { useUser } from "../context/UserContext"
import { useCsrf } from "../context/CsrfContext"
import { apiUrl } from "../utils/apiUtil"
import CreatePostModal from "./CreatePostModal"
import CreateEventModal from "./CreateEventModal"
import PostComments from "./PostComments"
import {
  Home,
  Calendar,
  LogOut,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Plus,
  Filter,
  MapPin,
  Clock,
  X,
  Search,
  Bell,
  Menu,
  User,
  HandHelping,
  HelpCircle,
  Share2,
} from "lucide-react"

function MainPage() {
  const navigate = useNavigate()
  const { userId } = useUser()
  const { csrfToken } = useCsrf()

  // State declarations
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [neighbors, setNeighbors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [expandedComments, setExpandedComments] = useState({})
  const [showContentDropdown, setShowContentDropdown] = useState(null)
  const [postLikes, setPostLikes] = useState({})
  const [userInfo, setUserInfo] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  // Add this state and effect for mobile detection
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Fetch user data and posts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!userId) {
          throw new Error("User ID not found. Please log in again.")
        }

        // Fetch user data
        const userResponse = await axios.get(apiUrl(`api/users/user/${userId}`), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })
        setUserInfo(userResponse.data)

        // Fetch posts by zip code
        const postsResponse = await axios.get(apiUrl("api/posts/zip"), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })

        const fetchedPosts = postsResponse.data || []
        fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPosts(fetchedPosts)
        setFilteredPosts(fetchedPosts)

        // Fetch likes for each post
        for (const post of fetchedPosts) {
          await fetchPostLikes(post._id)
        }

        // Fetch events by zip code
        const eventsResponse = await axios.get(apiUrl("api/events/zip"), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })

        let fetchedEvents = []
        if (eventsResponse.data && eventsResponse.data.events) {
          fetchedEvents = eventsResponse.data.events || []
        } else {
          fetchedEvents = eventsResponse.data || []
        }

        fetchedEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
        setEvents(fetchedEvents)

        // Fetch neighbors by zip code
        if (userResponse.data.postalCode) {
          const neighborsResponse = await axios.get(apiUrl(`api/users/zip/${userResponse.data.postalCode}`), {
            withCredentials: true,
            headers: { "X-CSRF-Token": csrfToken },
          })

          const allNeighbors = neighborsResponse.data || []
          setNeighbors(allNeighbors.filter((neighbor) => neighbor._id !== userId))
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, csrfToken])

  // Filter posts when search query or active filter changes
  useEffect(() => {
    if (!posts) return

    let filtered = [...posts]

    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "requests") {
        filtered = filtered.filter(
          (post) =>
            post.category &&
            post.category.some(
              (cat) =>
                cat.toLowerCase().includes("request") ||
                cat.toLowerCase().includes("help") ||
                cat.toLowerCase().includes("need"),
            ),
        )
      } else if (activeFilter === "offers") {
        filtered = filtered.filter(
          (post) =>
            post.category &&
            post.category.some(
              (cat) =>
                cat.toLowerCase().includes("offer") ||
                cat.toLowerCase().includes("giving") ||
                cat.toLowerCase().includes("free"),
            ),
        )
      } else if (activeFilter === "events") {
        filtered = events
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          (post.category && post.category.some((cat) => cat.toLowerCase().includes(query))),
      )
    }

    setFilteredPosts(filtered)
  }, [posts, events, searchQuery, activeFilter])

  // Fetch likes for a post
  const fetchPostLikes = async (postId) => {
    try {
      const response = await axios.get(apiUrl(`api/posts/likes/${postId}`), {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      })

      setPostLikes((prev) => ({
        ...prev,
        [postId]: {
          count: response.data.count,
          userIds: response.data.likes.map((like) => like.userId),
        },
      }))
    } catch (err) {
      console.error("Error fetching post likes:", err)
    }
  }

  // Handle post like
  const handlePostLike = async (postId) => {
    try {
      await axios.post(
        apiUrl(`api/posts/${postId}/like`),
        { userId },
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        },
      )

      setPostLikes((prev) => {
        const currentLikes = prev[postId] || { count: 0, userIds: [] }
        const userLikedIndex = currentLikes.userIds.indexOf(userId)

        if (userLikedIndex !== -1) {
          const newUserIds = [...currentLikes.userIds]
          newUserIds.splice(userLikedIndex, 1)
          return {
            ...prev,
            [postId]: {
              count: currentLikes.count - 1,
              userIds: newUserIds,
            },
          }
        } else {
          return {
            ...prev,
            [postId]: {
              count: currentLikes.count + 1,
              userIds: [...currentLikes.userIds, userId],
            },
          }
        }
      })

      await fetchPostLikes(postId)
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  // Handle event like
  const handleEventLike = async (eventId) => {
    try {
      await axios.post(
        apiUrl(`api/events/${eventId}/like`),
        { userId },
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        },
      )

      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event._id === eventId) {
            const userLiked = event.likes?.includes(userId)
            return {
              ...event,
              likes: userLiked ? event.likes.filter((id) => id !== userId) : [...(event.likes || []), userId],
            }
          }
          return event
        }),
      )
    } catch (err) {
      console.error("Error liking event:", err)
    }
  }

  // Handle post creation
  const handlePostCreated = (newPost) => {
    if (newPost.type === "event") {
      setEvents((prev) => [newPost, ...prev])
      setActiveFilter("events")
    } else {
      setPosts((prev) => [newPost, ...prev])
      setFilteredPosts((prev) => [newPost, ...prev])
    }
  }

  // Delete item
  const deleteItem = async (itemId, itemType) => {
    try {
      await axios.delete(apiUrl(`api/${itemType}/${itemId}`), {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      })

      if (itemType === "posts") {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== itemId))
        setFilteredPosts((prevPosts) => prevPosts.filter((post) => post._id !== itemId))
      } else if (itemType === "events") {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== itemId))
      }

      setShowContentDropdown(null)
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userId")
    navigate("/login")
  }

  const hasUserLikedPost = (postId) => {
    const postLikeData = postLikes[postId]
    return postLikeData && postLikeData.userIds && postLikeData.userIds.includes(userId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="h-12 w-12 text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-1 font-medium text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className="flex items-center gap-1 font-medium text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  const renderPost = (post) => (
    <div key={post._id} className="bg-white dark:bg-white rounded-lg shadow-sm relative mb-4">
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <div className="flex items-center">
          {post.createdBy && (
            <div
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mr-3 cursor-pointer"
              onClick={() => navigate(`/profile/${post.createdBy._id}`)}
            >
              {post.createdBy.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              {post.category && post.category.length > 0 && (
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                  {post.category[0]}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  post.status === "open"
                    ? "bg-green-100 text-green-800"
                    : post.status === "in progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : "Unknown"}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={() =>
              setShowContentDropdown(showContentDropdown?.id === post._id ? null : { id: post._id, type: "posts" })
            }
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showContentDropdown?.id === post._id && showContentDropdown?.type === "posts" && (
            <div className="absolute right-0 top-2 mt-4 w-40 bg-white border border-gray-50 rounded-md shadow-xl z-10">
              <div className="dropdown-menu">
                {post.createdBy._id === userId && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2 hover:bg-gray-50"
                    onClick={() => deleteItem(post._id, "posts")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    Delete
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => {
                    // Share functionality
                    setShowContentDropdown(null)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 text-gray-700">{post.description}</div>
      <div className="px-6 py-3 border-t flex justify-between text-sm text-gray-600">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-1 ${hasUserLikedPost(post._id) ? "text-purple-600" : ""}`}
            onClick={() => handlePostLike(post._id)}
          >
            <ThumbsUp className="h-4 w-4" />
            {postLikes[post._id]?.count || 0}
          </button>
          <button className="flex items-center gap-1" onClick={() => toggleComments(post._id)}>
            <MessageSquare className="h-4 w-4" />
            Comment
          </button>
        </div>
        <button className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>

      {expandedComments[post._id] && (
        <div className="px-6 py-4 border-t">
          <PostComments postId={post._id} />
        </div>
      )}
    </div>
  )

  const renderEvent = (event) => (
    <div key={event._id} className="bg-white dark:bg-white rounded-lg shadow-sm overflow-hidden relative mb-4">
      {event.eventImage?.url && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.eventImage.url || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <div>
          <div className="flex items-center">
            {event.createdBy && (
              <div
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mr-3 cursor-pointer"
                onClick={() => navigate(`/profile/${event.createdBy._id}`)}
              >
                {event.createdBy.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Event</span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                  {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                  {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={() =>
              setShowContentDropdown(showContentDropdown?.id === event._id ? null : { id: event._id, type: "events" })
            }
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showContentDropdown?.id === event._id && showContentDropdown?.type === "events" && (
            <div className="absolute right-0 top-2 mt-4 w-40 bg-white border border-gray-50 rounded-md shadow-xl z-10">
              <div className="dropdown-menu">
                {event.createdBy._id === userId && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2 hover:bg-gray-50"
                    onClick={() => deleteItem(event._id, "events")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    Delete
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => {
                    // Share functionality
                    setShowContentDropdown(null)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 text-gray-700">{event.description}</div>
      <div className="px-6 pb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {event.streetAddress}
        </div>
        {event.hobbies && event.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.hobbies.map((hobby, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-800">
                {hobby}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-6 py-3 border-t flex justify-between text-sm text-gray-600">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-1 ${event.likes?.includes(userId) ? "text-purple-600" : ""}`}
            onClick={() => handleEventLike(event._id)}
          >
            <ThumbsUp className="h-4 w-4" />
            {event.likes?.length || 0}
          </button>
        </div>
        <button className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-800">NeighbourConnect</h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/profile")}>
                {userInfo?.avatar?.url ? (
                  <img
                    src={userInfo.avatar.url || "/placeholder.svg"}
                    alt={userInfo.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-semibold text-purple-700">
                    {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="font-medium text-gray-700">{userInfo?.name?.split(" ")[0]}</span>
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md z-40 fixed inset-0 pt-16">
          <div className="p-4">
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col space-y-4 mt-4">
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-lg font-semibold text-purple-700">
                  {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium">{userInfo?.name}</div>
                  <div className="text-sm text-gray-500">{userInfo?.email}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/profile")
                    setMobileMenuOpen(false)
                  }}
                >
                  <User className="h-5 w-5 text-gray-500" />
                  <span>Profile</span>
                </div>

                <div
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowCreatePostModal(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Plus className="h-5 w-5 text-gray-500" />
                  <span>Create Post</span>
                </div>

                <div
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowCreateEventModal(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Create Event</span>
                </div>

                <div
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-20">
              <div className="flex flex-col space-y-1">
                <button
                  className={`flex items-center space-x-2 p-2 rounded-md ${activeFilter === "all" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("all")}
                >
                  <Home className="h-5 w-5" />
                  <span>All Posts</span>
                </button>

                <button
                  className={`flex items-center space-x-2 p-2 rounded-md ${activeFilter === "requests" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("requests")}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Requests</span>
                </button>

                <button
                  className={`flex items-center space-x-2 p-2 rounded-md ${activeFilter === "offers" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("offers")}
                >
                  <HandHelping className="h-5 w-5" />
                  <span>Offers</span>
                </button>

                <button
                  className={`flex items-center space-x-2 p-2 rounded-md ${activeFilter === "events" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("events")}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Neighbors</h3>
                {neighbors.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {neighbors.slice(0, 5).map((neighbor) => (
                      <div
                        key={neighbor._id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                        onClick={() => navigate(`/profile/${neighbor._id}`)}
                      >
                        {neighbor.avatar?.url ? (
                          <img
                            src={neighbor.avatar.url || "/placeholder.svg"}
                            alt={neighbor.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                            {neighbor.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm">{neighbor.name}</div>
                          <div className="text-xs text-gray-500">{neighbor.postalCode}</div>
                        </div>
                      </div>
                    ))}
                    {neighbors.length > 5 && (
                      <button
                        className="text-purple-700 text-sm font-medium hover:underline w-full text-center mt-2"
                        onClick={() => navigate("/neighbors")}
                      >
                        View all neighbors ({neighbors.length})
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No neighbors found in your area.</p>
                )}
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <button
                className="w-full flex items-center justify-center space-x-2 bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </button>

              <button
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md mt-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Create post buttons */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center space-x-3">
                {userInfo?.avatar?.url ? (
                  <img
                    src={userInfo.avatar.url || "/placeholder.svg"}
                    alt={userInfo.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                    {userInfo?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 text-left text-gray-500"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  What's on your mind, {userInfo?.name?.split(" ")[0]}?
                </button>
              </div>

              <div className="flex mt-3 pt-3 border-t border-gray-100">
                <button
                  className="flex-1 flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  <Plus className="h-5 w-5 text-purple-700" />
                  <span>Create Post</span>
                </button>

                <button
                  className="flex-1 flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setShowCreateEventModal(true)}
                >
                  <Calendar className="h-5 w-5 text-purple-700" />
                  <span>Create Event</span>
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filter:</span>
              </div>

              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${activeFilter === "all" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${activeFilter === "requests" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("requests")}
                >
                  Requests
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${activeFilter === "offers" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("offers")}
                >
                  Offers
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${activeFilter === "events" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActiveFilter("events")}
                >
                  Events
                </button>
              </div>
            </div>

            {/* Posts list */}
            <div className="space-y-4">
              {activeFilter === "events" ? (
                events && events.length > 0 ? (
                  events.map(renderEvent)
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500 mb-4">No events found. Create your first event!</p>
                    <button
                      className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 inline-flex items-center"
                      onClick={() => setShowCreateEventModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </button>
                  </div>
                )
              ) : filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map(renderPost)
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500 mb-4">No posts found. Create your first post!</p>
                  <button
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 inline-flex items-center"
                    onClick={() => setShowCreatePostModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onEventCreated={handlePostCreated}
      />
    </div>
  )
}

export default MainPage
