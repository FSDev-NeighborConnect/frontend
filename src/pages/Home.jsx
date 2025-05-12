import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../assets/neigh.png'
import support from '../assets/support.png'
import hobbies from '../assets/hobbies.png'
import events from '../assets/events.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-[rgb(251,241,241)]">
      {/* Main Container */}
      <div className="mx-auto w-full max-w-[1600px] px-5 py-16">
        {/* Hero Section - left text, right image */}
        <section className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left side - text and buttons */}
          <div className="md:ml-10 max-w-[600px] pt-8 md:pt-12">
            <h1 className="text-[#4a148c] text-3xl font-bold">NeighbourConnect</h1>
            <h4 className="text-xl mt-2">Connecting Neighbors, Online</h4>
            <p className="text-gray-600 mt-4 text-lg">
              Join your local online community to connect with neighbours.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                className="px-5 py-3 bg-[#7e57c2] hover:bg-[#6d4baf] text-white rounded-md transition-colors"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
              <button 
                className="px-5 py-3 bg-[#7e57c2] hover:bg-[#6d4baf] text-white rounded-md transition-colors"
                onClick={() => navigate('/login')}
              >
                Log In
              </button>
              <button 
                className="px-5 py-3 bg-[#7e57c2] hover:bg-[#6d4baf] text-white rounded-md transition-colors"
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Right side - image */}
          <div className="w-full md:w-[calc(100%-650px)] mt-8 md:mt-0">
            <img 
              src={img} 
              alt="Neighbors illustration" 
              className="w-full max-w-[850px] ml-auto" 
            />
          </div>
        </section>

        {/* Three cards section at the bottom */}
        <section className="flex flex-col md:flex-row justify-between gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[250px]">
            <img src={hobbies} alt="Hobby Groups" className="w-20 mb-4" />
            <h3 className="text-xl font-semibold">Hobby Groups</h3>
            <p className="text-gray-600 mt-2">
              Connect with neighbours who share your interests — from gardening and painting to book clubs and cycling. Find your tribe right next door!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[250px]">
            <img src={events} alt="Local Events" className="w-8 mb-4" />
            <h3 className="text-xl font-semibold">Local Events</h3>
            <p className="text-gray-600 mt-2">
              Discover and organize events, activities, community meetups, cultural festivals and more. Discover what's happening around you and join the fun!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[250px]">
            <img src={support} alt="Neighbour Support" className="w-8 mb-4" />
            <h3 className="text-xl font-semibold">Neighbour Support</h3>
            <p className="text-gray-600 mt-2">
              Offer help or ask for support—whether it's picking up groceries, sharing tools, or just being there for a chat. Together, we make the neighbourhood stronger.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
