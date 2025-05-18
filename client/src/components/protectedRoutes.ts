"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/utils"



export default function ProtectedRoute() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
    const [data, setdata] = useState<any>()
    const [apiError, setApiError] = useState<string | null>(null)
  


const checkAuth = async () =>{
        try {
          const res = await api.get("/auth/authorizeuser")
          console.log(res.data);
          setdata(res.data.products)
          setIsAuthenticated(true)
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            if (error.response.status === 401) {
              const errorMessage = error.response.data.message || error.response.data.error
              setApiError(errorMessage || "unauthorized user")
            }
            else{
              setApiError(error.response.data.message || "Server error. Please try again later")
            }
          } else if (error.request) {
            setApiError("No response from server. Please check your internet connection and try again later.")
          } else {
            setApiError("An error occurred. Please try again.")
          }

}


  useEffect(() => {

    checkAuth()

  },[])

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <div className="h-12 w-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     )
  }

  return isAuthenticated
}
