"use client"

import { useState, useEffect } from "react"
import { Send, AlertCircle } from "lucide-react"
import axios from "axios"
import { useUser } from "../context/UserContext"
import { useCsrf } from "../context/CsrfContext"

function PostComments({ postId, initialComments = [] }) {
  const { userId } = useUser()
  const { csrfToken } = useCsrf()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Update comments if initialComments changes
    setComments(initialComments)
  }, [initialComments])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `/api/posts/${postId}/comments`,
        { content: newComment, userId },
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        },
      )

      // Add the new comment to the list
      setComments([...comments, response.data])
      setNewComment("")
    } catch (err) {
      console.error("Error posting comment:", err)
      setError("Failed to post comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src={comment.user?.avatar?.url || "/placeholder.svg"}
                  alt={comment.user?.name || "User"}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{comment.user?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <form onSubmit={handleSubmitComment} className="flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="px-4 py-2 bg-purple-700 text-white rounded-r-md hover:bg-purple-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  )
}

export default PostComments
