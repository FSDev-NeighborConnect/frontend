import React from "react"

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null

  return (
    <div className="fixed z-10 inset-0">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        
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
          sm:my-8 sm:max-w-lg sm:w-full
        ">
          {/* Modal Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto">
              User Information
            </h3>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Street Address:</strong> {user.streetAddress}</p>
              <p><strong>Postal Code:</strong> {user.postalCode}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Avatar Url:</strong> {user.avatarUrl|| "N/A"}</p>
              <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Hobbies:</strong> {user.hobbies?.join(", ") || "N/A"}</p>
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
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

export default UserDetailModal
