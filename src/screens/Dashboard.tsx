// src/screens/Dashboard.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/auth/me'

interface UserData {
  _id: string
  name: string
  email: string
  createdAt: string
  // Add other fields based on your API response
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          setUserData(response.data.user)
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch user data')
          if (err.response?.status === 401) {
            localStorage.removeItem('token')
            navigate('/login')
          }
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (!localStorage.getItem('token')) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : userData ? (
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {userData.name[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {userData.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {userData.email}
                </div>
                <div>
                  <span className="font-medium">Account Created:</span>{' '}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}