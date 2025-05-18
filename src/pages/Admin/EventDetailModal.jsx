import React from "react"

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null

  // Helper function to format time
  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"
  }

  // Helper function to format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A"
  }

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
            <div className="flex items-start">
              {event.eventImage?.url && (
                <img 
                  src={event.eventImage.url} 
                  alt="Event cover" 
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
              )}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto">
                  Event Details
                </h3>
                <h4 className="text-md font-semibold mt-1">{event.title}</h4>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="px-4 overflow-y-auto flex-grow">
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <p><strong>Description:</strong> {event.description}</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Start Time:</strong> {formatTime(event.startTime)}</p>
                  <p><strong>End Time:</strong> {formatTime(event.endTime)}</p>
                </div>
                <div>
                  <p><strong>Street Address:</strong> {event.streetAddress}</p>
                  <p><strong>Postal Code:</strong> {event.postalCode}</p>
                </div>
              </div>

              <p><strong>Hobbies/Categories:</strong> 
                {event.hobbies?.length > 0 ? (
                  <span className="ml-1 inline-flex flex-wrap gap-1">
                    {event.hobbies.map((hobby, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
                      >
                        {hobby}
                      </span>
                    ))}
                  </span>
                ) : "None"}
              </p>

              <p><strong>Organizer:</strong> {event.createdBy?.name || "Unknown"}</p>
              <p><strong>Attendees:</strong> {event.rsvp?.length || 0} registered</p>
              
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p><strong>Created At:</strong> {new Date(event.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(event.updatedAt).toLocaleString()}</p>
              </div>
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

export default EventDetailModal