// import { useState } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1/auth/loginuser'

// const Login = () => {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     userName: '',
//     email: '',
//     password: ''
//   })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

 
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!formData.email || !formData.password || !formData.userName) {
//       return setError('Please fill in all fields')
//     }

//     try {
//       setLoading(true)
//       const response = await axios.post(API_URL, {
//         username: formData.userName,
//         email: formData.email,
//         password: formData.password
//       })

//       if (response.status === 200) {
//         // Set cookies with tokens
//         const accessExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
//         // const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
//         document.cookie = `accessToken=${
//           response.data.accessToken
//         }; expires=${accessExpires.toUTCString()}; path=/; Secure; : '' SameSite=Strict`;
        
//         // document.cookie = `refreshToken=${
//           // response.data.refreshToken
//         // }; expires=${refreshExpires.toUTCString()}; path=/; Secure; : '' SameSite=Strict`;

//         alert('Login successful! Redirecting to dashboard...')
//         navigate('/dashboard')
//       }

//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || 'Login failed')
//       } else {
//         setError('An unexpected error occurred')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="userName">Username</Label>
//               <Input
//                 id="userName"
//                 name="userName"
//                 type="text"
//                 placeholder="john"
//                 required
//                 value={formData.userName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             {error && (
//               <div className="text-red-500 text-sm">{error}</div>
//             )}

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </Button>
//           </form>

//           <div className="mt-4 text-center text-sm">
//             Don't have an account?{' '}
//             <Button
//               variant="link"
//               className="px-0"
//               onClick={() => navigate('/register')}
//             >
//               Register
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default Login



import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1/auth/loginuser'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password || !formData.userName) {
      return setError('Please fill in all fields')
    }

    try {
      setLoading(true)
      const response = await axios.post(API_URL, {
        username: formData.userName,
        email: formData.email,
        password: formData.password
      })

      if (response.status === 200) {
        // Store token in localStorage or context
        localStorage.setItem('token', response.data.accessToken)
        alert('Login successful! Redirecting to dashboard...')
        navigate('/dashboard')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="john"
                required
                value={formData.userName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="px-0"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

