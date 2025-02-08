import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1/auth/getdashboard'

interface Product {
  _id: string
  name: string
  price: number
  description: string
}

interface OrderItem {
  product: Product
  quantity: number
}

interface Order {
  _id: string
  totalAmount: number
  status: string
  items: OrderItem[]
}

interface UserData {
  _id: string
  username: string
  email: string
  role: string
  products: Product[]
  orders: Order[]
  createdAt: string
  updatedAt: string
}

// Helper function to retrieve a cookie by name without any external package
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(';').shift() || null
//   return null
// }

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       const token = localStorage.getItem('token')
        // if (!token) {
        //   navigate('/login')
        //   return
        // }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          setUserData(response.data.user)
          console.log(response.data);
          
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch user data')
          // if (err.response?.status === 401) {
            // localStorage.removeItem('token')
            // navigate('/login')
          // }
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }


    fetchDashboardData()
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : userData ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {userData.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{userData.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{userData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>{userData.products.length} products listed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>{userData.orders.length} orders placed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="capitalize px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>
                                  {item.product.name} x{item.quantity}
                                </span>
                                <span className="text-muted-foreground">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Dashboard
