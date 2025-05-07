"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Edit,
  Share2,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Plus,
  Users,
  Calendar,
  Grid3X3,
} from "lucide-react"
import "./userprofile.css"

const buttonBase = "flex items-center gap-1 font-medium text-sm"
const primaryBtn = `${buttonBase} bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md`
const secondaryBtn = `${buttonBase} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md`

function UserProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")

  // Mock user data for demo purposes
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
  role: "Member",
  joinDate: "January 2023",
  posts: [
    {
      id: 1,
      title: "Need help setting up garden bed",
      category: "Gardening",
      content:
        "I'm planning to build a raised garden bed this weekend. Anyone with experience who could lend a hand for an hour or two?",
      likes: 12,
      comments: 5,
      date: "2 days ago",
    },
      {
        id: 2,
        title: "Offering grocery pickup on Saturday",
        category: "Errands",
        content:
          "I'm heading to Trader Joe's on Saturday morning. Happy to pick up items for elderly or busy neighbors. Just let me know!",
        likes: 24,
        comments: 8,
        date: "1 week ago",
      },
      {
        id: 3,
        title: "Book club meeting this Thursday",
        category: "Reading",
        content:
          'Our neighborhood book club is meeting this Thursday at 7pm in the community center. We\'re discussing "The Dutch House" by Ann Patchett. All welcome!',
        likes: 18,
        comments: 12,
        date: "2 weeks ago",
      },
    ],
    friends: [
      { id: 1, name: "John Smith", avatarUrl: "https://i.pravatar.cc/150?img=12" },
      { id: 2, name: "Sarah Johnson", avatarUrl: "https://i.pravatar.cc/150?img=23" },
      { id: 3, name: "Michael Brown", avatarUrl: "https://i.pravatar.cc/150?img=45" },
      { id: 4, name: "Emily Davis", avatarUrl: "https://i.pravatar.cc/150?img=32" },
      { id: 5, name: "Robert Wilson", avatarUrl: "https://i.pravatar.cc/150?img=54" },
      { id: 6, name: "Lisa Thompson", avatarUrl: "https://i.pravatar.cc/150?img=25" },
    ],
    events: [
      { id: 1, title: "Community Garden Day", date: "May 15, 2023" },
      { id: 2, title: "Neighborhood Cleanup", date: "June 3, 2023" },
      { id: 3, title: "Summer Block Party", date: "July 8, 2023" },
    ],
  }

  useEffect(() => {
    // Simulate loading user data
    // In a real app, you would fetch data from your backend here
    setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const {
    avatarUrl,
    coverUrl,
    name,
    role,
    streetAddress,
    postalCode,
    email,
    phone,
    joinDate,
    bio,
    hobbies,
    posts,
    friends,
    events,
  } = user
  const avatar = avatarUrl || "/placeholder.svg"
  const cover = coverUrl || "/placeholder.svg"

  const renderPosts = () => (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm">
          <div className="px-6 pt-4 pb-2 flex justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-700">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-4 text-gray-700">{post.content}</div>
          <div className="px-6 py-3 border-t flex justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <button className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {post.comments}
              </button>
            </div>
            <button className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      ))}
      <button className={secondaryBtn + " w-full justify-center"}>
        <Plus className="h-4 w-4 mr-2" /> Create New Post
      </button>
    </div>
  )

  const renderFriends = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {friends.map((friend) => (
        <div key={friend.id} className="bg-white rounded-lg shadow-sm text-center p-4">
          <img
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            src={friend.avatarUrl || "/placeholder.svg"}
            alt={friend.name}
          />
          <h3 className="font-medium">{friend.name}</h3>
          <div className="mt-4 flex gap-2 justify-center text-sm">
            <button className="border px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Message
            </button>
            <button className="border px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Profile
            </button>
          </div>
        </div>
      ))}
      <div className="border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px] bg-white p-4">
        <button className="h-16 w-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
          <Plus className="h-8 w-8 text-gray-600" />
        </button>
        <p className="mt-2 text-gray-500 font-medium">Find Neighbors</p>
      </div>
    </div>
  )

  const renderEvents = () => (
    <div className="grid gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
            {event.date}
          </div>
          <div className="flex justify-between mt-4">
            <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">View Details</button>
            <button className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm">RSVP</button>
          </div>
        </div>
      ))}
      <button className={secondaryBtn + " w-full justify-center"}>
        <Plus className="h-4 w-4 mr-2" /> Create New Event
      </button>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Cover Image */}
      <div className="relative h-[300px] bg-gradient-to-r from-purple-700 to-purple-900 overflow-hidden">
        <img src={cover || "/placeholder.svg"} className="w-full h-full object-cover opacity-30" alt="Cover" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button className={secondaryBtn} onClick={() => navigate("/edit-profile")}>
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className={secondaryBtn}>
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="p-1.5 bg-white rounded-md shadow hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-[100px]">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <img
              src={avatar || "/placeholder.svg"}
              className="w-[180px] h-[180px] border-4 border-white shadow-lg rounded-full object-cover"
              alt={name}
            />
            <button className="absolute bottom-2 right-2 p-2 rounded-full bg-purple-700 text-white hover:bg-purple-800">
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 pt-4 md:pt-8">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">{role}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {streetAddress}, {postalCode}
              </span>
            </div>
            <div className="flex gap-2 mt-4 md:self-end md:pb-2">
              <button className={primaryBtn}>
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
              <button className={secondaryBtn}>
                <Users className="h-4 w-4" />
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">{bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hobbies.map((hobby, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200">
                {hobby}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
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
          <div className="flex border-b">
            {[
              { label: "Posts", value: "posts", icon: <Grid3X3 className="h-4 w-4" /> },
              { label: "Neighbors", value: "friends", icon: <Users className="h-4 w-4" /> },
              { label: "Events", value: "events", icon: <Calendar className="h-4 w-4" /> },
            ].map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`px-4 py-2 ${buttonBase} ${
                  activeTab === value
                    ? "border-b-2 border-purple-700 text-purple-700"
                    : "text-gray-500 hover:text-gray-700"
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
    </div>
  )
}

export default UserProfile
