import React from "react"

const PostDetailModal = ({ post, onClose }) => {
  if (!post) return null

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Centering the modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203; {/* Zero-Width Space used to center the modal */}
        </span>

        {/* Modal container */}
        <div className="
          inline-block align-middle bg-white rounded-lg 
          text-left overflow-hidden shadow-xl transform transition-all 
          sm:my-8 sm:max-w-lg sm:w-full max-h-[80vh] flex flex-col
        ">
          {/* Modal Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto">
              Post Details
            </h3>
            <h4 className="text-md font-semibold mt-1">{post.title}</h4>
          </div>

          {/* Scrollable content */}
          <div className="px-4 overflow-y-auto flex-grow">
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <p><strong>Description:</strong> {post.description}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  post.status === 'open' ? 'bg-green-100 text-green-800' :
                  post.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.status}
                </span>
              </p>
              <p><strong>Categories:</strong> {post.category?.join(", ") || "None"}</p>
              <p><strong>Street Address:</strong> {post.street}</p>
              <p><strong>Postal Code:</strong> {post.postalCode}</p>
              <p><strong>Created By:</strong> {post.createdBy.name || "Unknown"}</p>
              <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(post.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full inline-flex justify-center rounded-md border border-transparent
                shadow-sm px-4 py-2 bg-purple-700 text-base font-medium text-white
                hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-purple-600 sm:ml-3 sm:w-auto sm:text-sm font-roboto
              "
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailModal