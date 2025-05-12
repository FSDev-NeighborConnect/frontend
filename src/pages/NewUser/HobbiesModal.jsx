import React from 'react'

const hobbiesList = [
  'Gardening', 'Painting', 'Cooking', 'Reading', 'Cycling', 'Photography',
  'Hiking', 'Swimming', 'Running', 'Yoga', 'Meditation', 'Knitting',
  'Woodworking', 'Pottery', 'Drawing', 'Singing', 'Dancing', 'Writing',
  'Chess', 'Board Games', 'Video Games', 'Traveling', 'Baking', 'Fishing',
  'Camping', 'Kayaking', 'Rock Climbing', 'Golf', 'Tennis', 'Basketball',
  'Soccer', 'Volleyball', 'Calligraphy', 'Scrapbooking', 'Volunteering',
  'Beekeeping', 'Bonsai', 'Wine Tasting', 'Coffee Roasting'
]

const HobbiesModal = ({ selectedHobbies, toggleHobby, onClose }) => {
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
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203; {/* Zero-Width Space used to center the modal */}
        </span>

        {/* Modal container with scrollable content */}
        <div className="
            inline-block align-middle bg-white rounded-lg 
            text-left overflow-hidden shadow-xl transform 
            transition-all sm:my-8 sm:max-w-lg sm:w-full
            max-h-[80vh] flex flex-col
        ">
          
          {/* Modal header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 font-roboto">
              Select Your Hobbies
            </h3>
          </div>

          {/* Hobbies list */}
          <div className="px-4 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hobbiesList.map(hobby => (
                <div key={hobby} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`hobby-${hobby}`}
                      name="hobbies"
                      type="checkbox"
                      checked={selectedHobbies.includes(hobby)}
                      onChange={() => toggleHobby(hobby)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`hobby-${hobby}`} className="font-medium text-gray-700 font-roboto">
                      {hobby}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal footer */}
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

export default HobbiesModal
