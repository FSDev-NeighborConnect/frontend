"use client"

// Import necessary React hooks and components
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useUser } from "../context/UserContext"
import { useCsrf } from "../context/CsrfContext"
import CreatePostModal from "./CreatePostModal"
import CreateEventModal from "./CreateEventModal"
import PostComments from "./PostComments"
import { apiUrl, apiConfigCsrf } from "../utils/apiUtil"
import {
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Edit,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Plus,
  Users,
  Calendar,
  Grid3X3,
  AlertCircle,
  LogOut,
  Clock,
  Share2,
  Camera,
  ArrowLeft,
} from "lucide-react"
import "./userprofile.css"

// Define button styles
const buttonBase = "flex items-center gap-1 font-medium text-sm"
const primaryBtn = `${buttonBase} bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md`
const secondaryBtn = `${buttonBase} bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-md`

function UserProfile() {
  // State declarations
  const navigate = useNavigate()
  const { userId: urlUserId } = useParams()
  const { userId: loggedInUserId } = useUser()
  const { csrfToken } = useCsrf()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [neighbors, setNeighbors] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [expandedComments, setExpandedComments] = useState({})
  const [showProfileDropdown, setShowProfileDropdown] = useState(null)
  const [showContentDropdown, setShowContentDropdown] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [postLikes, setPostLikes] = useState({})

  // Current user ID determination
  const currentUserId = urlUserId || loggedInUserId || localStorage.getItem("userId")
  const isOwnProfile = !urlUserId || urlUserId === loggedInUserId || urlUserId === localStorage.getItem("userId")

  // Logout handler
  const handleLogout = async () => {
  try {
    await axios.post(
      apiUrl("api/logout"),
      {}, // Needed since it is a post request and needs to include a body
      apiConfigCsrf(csrfToken))

    navigate("/login")
  } catch (error) {
    console.error("Logout failed", error)
    navigate("/login")
  }
}

  // Handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingAvatar(true)

    try {
      const avatarFormData = new FormData()
      avatarFormData.append("avatar", file)

      const avatarResponse = await axios.post(apiUrl("api/users/upload-avatar"), avatarFormData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRF-Token": csrfToken,
        },
      })

      await fetchUserData()
    } catch (err) {
      console.error("Error uploading avatar:", err)
      alert("Failed to upload profile picture. Please try again.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Fetch likes for a post
  const fetchPostLikes = async (postId) => {
    try {
      const response = await axios.get(apiUrl(`api/posts/likes/${postId}`), {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      })

      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          count: response.data.count,
          userIds: response.data.likes.map(like => like.userId),
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
        { userId: currentUserId },
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        },
      )

      setPostLikes(prev => {
        const currentLikes = prev[postId] || { count: 0, userIds: [] }
        const userLikedIndex = currentLikes.userIds.indexOf(currentUserId)

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
              userIds: [...currentLikes.userIds, currentUserId],
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
        { userId: currentUserId },
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        },
      )

      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event._id === eventId) {
            const userLiked = event.likes?.includes(currentUserId)
            return {
              ...event,
              likes: userLiked
                ? event.likes.filter(id => id !== currentUserId)
                : [...(event.likes || []), currentUserId],
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
      setEvents(prev => [newPost, ...prev])
      setActiveTab("events")
    } else {
      setPosts(prev => [newPost, ...prev])
    }
  }

  // Delete item
  const deleteItem = async (itemId, itemType) => {
    try {
      const response = await axios.delete(apiUrl(`api/${itemType}/${itemId}`), {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      })

      if (itemType === "posts") {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== itemId))
      } else if (itemType === "events") {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== itemId))
      }

      setShowContentDropdown(null)
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  // Fetch user data and posts
  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!currentUserId) {
        throw new Error("User ID not found. Please log in again.")
      }

      const userResponse = await axios.get(apiUrl(`api/users/user/${currentUserId}`), {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      })

      const userData = userResponse.data
      setUser(userData)

      try {
        const postsResponse = await axios.get(apiUrl(`api/posts/user/${currentUserId}`), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })
        setPosts(postsResponse.data || [])

        // Sort posts by createdAt date, newest first
        const fetchedPosts = postsResponse.data || []
        fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPosts(fetchedPosts)

        // Fetch likes for each post
        for (const post of fetchedPosts) {
          await fetchPostLikes(post._id)
        }
      } catch (postError) {
        console.error("Error fetching posts:", postError)
        setPosts([])
      }

      try {
        const eventsResponse = await axios.get(apiUrl(`api/events/user/${currentUserId}`), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })

        let fetchedEvents = []
        if (eventsResponse.data && eventsResponse.data.eventDetails) {
          fetchedEvents = eventsResponse.data.eventDetails || []
        } else {
          fetchedEvents = eventsResponse.data || []
        }

        fetchedEvents.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        setEvents(fetchedEvents)
      } catch (eventError) {
        console.error("Error fetching events:", eventError)
        setEvents([])
      }

      if (isOwnProfile && userData.postalCode) {
        const neighborsResponse = await axios.get(apiUrl(`api/users/zip/${userData.postalCode}`), {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        })

        const allNeighbors = neighborsResponse.data || []
        setNeighbors(allNeighbors.filter(neighbor => neighbor._id !== currentUserId))
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err.response?.data?.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUserId) {
      fetchUserData()
    } else {
      setLoading(false)
      setError("User ID not found. Please log in again.")
    }
  }, [currentUserId, csrfToken])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setShowProfileDropdown(null)
        setShowContentDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown, showContentDropdown])

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
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <div className="flex gap-4">
          <button className={primaryBtn} onClick={() => window.location.reload()}>Try Again</button>
          <button className={secondaryBtn} onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    )
  }

  if (!user) return null

  const { name, email, streetAddress, postalCode, phone, bio, hobbies, role, createdAt, avatar, cover } = user
  const avatarUrl = avatar?.url
  const coverUrl = cover?.url || "/placeholder.svg"
  const joinDate = new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })

  const hasUserLikedPost = (postId) => {
    const postLikeData = postLikes[postId]
    return postLikeData && postLikeData.userIds && postLikeData.userIds.includes(currentUserId)
  }

  const renderPost = (post) => (
    <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm relative">
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {post.category && (
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                {post.category[0]}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              post.status === "open"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : post.status === "in progress"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}>
              {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : "Unknown"}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="relative">
          {isOwnProfile && (
            <button 
              className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setShowContentDropdown(showContentDropdown?.id === post._id ? null : { id: post._id, type: "posts" })}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          )}
          
          {/* Dropdown Menu */}
          {showContentDropdown?.id === post._id && showContentDropdown?.type === "posts" && (
            <div className="absolute right-0 top-2 mt-4 w-40 bg-white border border-gray-50 dark:bg-gray-800 rounded-md shadow-xl z-10">
              <div className="dropdown-menu">
                <button 
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                  onClick={() => deleteItem(post._id, "posts")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 text-gray-700 dark:text-gray-300">{post.description}</div>
      <div className="px-6 py-3 border-t dark:border-gray-700 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-1 ${hasUserLikedPost(post._id) ? "text-purple-600 dark:text-purple-400" : ""}`}
            onClick={() => handlePostLike(post._id)}
          >
            <ThumbsUp className="h-4 w-4" />
            {postLikes[post._id]?.count || 0}
          </button>
          <button className="flex items-center gap-1" onClick={() => toggleComments(post._id)}>
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
        <button className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>

      {expandedComments[post._id] && (
        <div className="px-6 py-4 border-t dark:border-gray-700">
          <PostComments postId={post._id}/>
        </div>
      )}
    </div>
  )

  const renderEvent = (event) => (
    <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden relative">
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full font-medium">
              Event
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
              {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <div className="relative">
          {isOwnProfile && (
            <button 
              className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setShowContentDropdown(showContentDropdown?.id === event._id ? null : { id: event._id, type: "events" })}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          )}
          
          {/* Dropdown Menu */}
          {showContentDropdown?.id === event._id && showContentDropdown?.type === "events" && (
            <div className="absolute right-0 top-2 mt-4 w-40 bg-white border border-gray-50 dark:bg-gray-800 rounded-md shadow-xl z-10">
              <div className="dropdown-menu">
                <button 
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                  onClick={() => deleteItem(event._id, "events")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 text-gray-700 dark:text-gray-300">{event.description}</div>
      {event.hobbies && event.hobbies.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1">
            {event.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-800 dark:text-gray-300"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="px-6 py-3 border-t dark:border-gray-700 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-1 ${event.likes?.includes(currentUserId) ? "text-purple-600 dark:text-purple-400" : ""}`}
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

  const renderPosts = () => (
    <div className="space-y-4">
      {posts && posts.length > 0 ? (
        posts.map(renderPost)
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No posts yet. Create your first post!</p>
        </div>
      )}
      {isOwnProfile && (
        <button className={`${secondaryBtn} w-full justify-center`} onClick={() => setShowCreatePostModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Post
        </button>
      )}
    </div>
  )

  const renderFriends = () => (
    <div className="space-y-4">
      {neighbors && neighbors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {neighbors.map((neighbor) => (
            <div
              key={neighbor._id}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center"
            >
              {neighbor.avatar?.url ? (
                <img
                  src={neighbor.avatar.url}
                  alt={neighbor.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 mb-3">
                  {neighbor.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
              <h3 className="font-medium text-gray-900 dark:text-white">{neighbor.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{neighbor.postalCode}</p>
              <div className="flex gap-2 mt-auto">
                <button
                  className="px-3 py-1 text-xs bg-purple-700 text-white rounded-md hover:bg-purple-800 flex items-center"
                  onClick={() => navigate(`/profile/${neighbor._id}`)}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Profile
                </button>
                <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No neighbors found in your area.</p>
        </div>
      )}
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-4">
      {events && events.length > 0 ? (
        events.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).map(renderEvent)
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No events yet. Create your first event!</p>
        </div>
      )}
      {isOwnProfile && (
        <button className={`${secondaryBtn} w-full justify-center`} onClick={() => setShowCreateEventModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Event
        </button>
      )}
    </div>
  )

  const tabs = [
    { label: "Posts", value: "posts", icon: <Grid3X3 className="h-4 w-4" /> },
    ...(isOwnProfile ? [{ label: "Neighbors", value: "friends", icon: <Users className="h-4 w-4" /> }] : []),
    { label: "Events", value: "events", icon: <Calendar className="h-4 w-4" /> },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {!isOwnProfile && (
              <button
                onClick={() => navigate(-1)}
                className="mr-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="font-medium">Back</span>
              </button>
            )}
            <h1 style={{ color: "#4a148c", fontSize: "24px" }}>NeighbourConnect</h1>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-[300px] bg-gradient-to-r from-purple-700 to-purple-900 overflow-hidden">
        <img src={coverUrl || "/placeholder.svg"} className="w-full h-full object-cover" alt="Cover" />

        {/* Action buttons in top right of cover */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwnProfile ? (
            <>
              <button
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 font-medium text-sm"
                onClick={() => navigate("/edit-profile")}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
              <button
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 font-medium text-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button className={primaryBtn}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </button>
              <button className={secondaryBtn}>
                <Users className="h-4 w-4 mr-1" />
                Connect
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Share2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex relative -mt-[75px]">
          <div className="relative z-10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                className="w-[150px] h-[150px] border-4 border-white dark:border-gray-800 shadow-lg rounded-full object-cover"
                alt={name}
              />
            ) : (
              <div className="w-[150px] h-[150px] border-4 border-white dark:border-gray-800 shadow-lg rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-5xl font-bold text-gray-600 dark:text-gray-300">
                {name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            {isOwnProfile && (
              <label className="absolute bottom-2 right-2 p-2 rounded-full bg-purple-700 text-white hover:bg-purple-800 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                />
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
            )}
          </div>

          {/* User Info - Positioned to the right of the profile image */}
          <div className="ml-6 mt-[75px]">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">
                {role || "Member"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {streetAddress}, {postalCode}
              </span>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 dark:text-gray-300">{bio || "No bio provided yet."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hobbies && hobbies.length > 0 ? (
              hobbies.map((hobby, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {hobby}
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No hobbies added yet.</span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {phone}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Joined {joinDate}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex border-b dark:border-gray-700">
            {tabs.map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`px-4 py-2 ${buttonBase} ${
                  activeTab === value
                    ? "border-b-2 border-purple-700 text-purple-700 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "posts" && renderPosts()}
            {activeTab === "friends" && renderFriends()}
            {activeTab === "events" && renderEvents()}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => {
          setShowCreatePostModal(false)
          fetchUserData()
        }}
        onPostCreated={handlePostCreated}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => {
          setShowCreateEventModal(false)
          fetchUserData()
        }}
        onEventCreated={handlePostCreated}
      />
    </div>
  )
}

export default UserProfile