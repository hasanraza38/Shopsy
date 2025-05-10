"use client"
import Link from 'next/link'
import React, { useRef, useState } from 'react'

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const[isLoggedIn, setIsLoggedIn] = useState(false)
  const dropdownRef = useRef(null)
  
    return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              {/* <img
                className="h-12 w-auto"
                src={saylaniLogo}
                alt="Saylani Logo"
              /> */}
              <h1>logo</h1>
            </Link>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <span className="mr-2">My Account</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    
                    <button
                    //   onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                //   onClick={onLoginClick}
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                //   onClick={onSignupClick}
                  className="bg-[#8dc63f] hover:bg-[#8ec63fe7] text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar