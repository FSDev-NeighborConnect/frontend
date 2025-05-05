"use client"

import { useState, useEffect } from "react"
import "./userProfile.css"
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

function UserProfile() {
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

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full bg-gradient-to-r from-purple-700 to-purple-900 overflow-hidden">
        <img src={user.coverUrl || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover opacity-30" />

        {/* Profile Actions - Top Right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="px-3 py-1.5 bg-white text-sm font-medium text-gray-700 rounded-md shadow flex items-center gap-1 hover:bg-gray-100">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
          <button className="px-3 py-1.5 bg-white text-sm font-medium text-gray-700 rounded-md shadow flex items-center gap-1 hover:bg-gray-100">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <div className="relative">
            <button className="p-1.5 bg-white text-sm font-medium text-gray-700 rounded-md shadow flex items-center hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px] relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-[180px] h-[180px] rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img src={user.avatarUrl || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-2 right-2 rounded-full bg-purple-700 hover:bg-purple-800 p-2 text-white">
              <Edit className="h-4 w-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 pt-4 md:pt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {user.streetAddress}, {user.postalCode}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> Message
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md flex items-center gap-1 hover:bg-gray-50">
                  <Users className="h-4 w-4" /> Connect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">{user.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
              >
                {hobby}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="mt-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === "posts"
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid3X3 className="h-4 w-4" /> Posts
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === "friends"
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="h-4 w-4" /> Neighbors
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
                activeTab === "events"
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Calendar className="h-4 w-4" /> Events
            </button>
          </div>

          <div className="py-6">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                {user.posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 pt-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500">{post.date}</span>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-gray-700">{post.content}</p>
                    </div>
                    <div className="px-6 py-3 border-t flex justify-between">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" /> Create New Post
                </button>
              </div>
            )}

            {/* Friends Tab */}
            {activeTab === "friends" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {user.friends.map((friend) => (
                  <div key={friend.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                        <img
                          src={friend.avatarUrl || "/placeholder.svg"}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{friend.name}</h3>
                      <div className="mt-4 flex gap-2">
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-50 flex-1">
                          <MessageSquare className="h-3 w-3" /> Message
                        </button>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-50 flex-1">
                          <Users className="h-3 w-3" /> Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-dashed border-gray-300">
                  <div className="p-4 flex flex-col items-center justify-center h-full min-h-[200px]">
                    <button className="rounded-full h-16 w-16 flex items-center justify-center bg-gray-100 hover:bg-gray-200 mb-2">
                      <Plus className="h-8 w-8 text-gray-600" />
                    </button>
                    <p className="text-gray-500 font-medium">Find Neighbors</p>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="grid gap-4">
                {user.events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <CalendarDays className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex justify-between">
                      <button className="px-3 py-1 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-purple-700 text-white text-sm font-medium rounded hover:bg-purple-800">
                        RSVP
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" /> Create New Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
