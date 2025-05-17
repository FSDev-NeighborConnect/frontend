import React from "react"

const CommentDetailModal = ({ comment, onClose }) => {
  if (!comment) return null

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
          <div className="bg-white px-4 pt-5 pb-6 sm:p-6 sm:pb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto mb-3">
              Comment Details
            </h3>
            <h4 className="text-md font-semibold text-gray-800">
              Author: {comment.author?.name || 'Unknown'}
            </h4>
          </div>

          {/* Scrollable content */}
          <div className="px-4 py-4 pb-8 overflow-y-auto flex-grow min-h-[200px]">
            <div className="space-y-4 text-sm text-gray-700">
              <p className="whitespace-pre-wrap text-gray-900 font-medium leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
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

export default CommentDetailModal
