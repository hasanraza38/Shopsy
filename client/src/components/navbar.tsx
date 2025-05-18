"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { api, checkAuth, logOut } from '@/helper/api'
import { Loader2 } from 'lucide-react'


type FormData = {
  name: string;
  description: string;
  price: number;
  image: FileList | null;
};

type User = {
  user: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  }
}

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLogout, setUserLogout] = useState(false);



  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();


  const onSubmit = async (data: FormData) => {

    setIsLoading(true)
    setApiError(null)

    try {
      const file = data.image?.[0]
      // console.log(file);

      const formData = new FormData()
      if (file) { formData.append("image", file) }
      else {
        console.log('image is required');
      }
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", data.price.toString())



      const response = await api.post("product/addproduct", formData)
      // console.log(response.data)
      toast.success("Product Added Successfully Redirecting to Dashboard...")
      window.location.reload()
    } catch (error: any) {
      console.error("error:", error)
      setFormData(data)

      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage || "Please check your information and try again.")
        }
        else if (error.response.status === 401) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage || "Please check your information and try again.")
        }
        else if (error.response.status === 500) {
          setApiError(error.response.data.message || "Server error. Please try again later")
        } else {
          setApiError(error.response.data.message || "Registration failed. Please try again.")
        }
      } else if (error.request) {
        setApiError("No response from server. Please check your internet connection and try again later.")
      } else {
        setApiError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
      setOpenDialog(false)

    }
  }

  useEffect(() => {
    const getUser = async () => {
      const userData = await checkAuth();
      // console.log(userData);

      if (userData) {
        setUser(userData);
      }else{
        setUser(null)
      }
    };
    getUser();
  }, [userLogout]);



  const logOutUser = async () => {
    try {
      const response = await logOut();
      setUserLogout(prev => !prev)
      toast.success("Logout Successful");
      setUser(null);
    } catch (error:any) {
      console.error("error:", error.message);
      toast.error("Logout Failed");
    }
  }
  
  
    return (
      <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
              <Link href="/">
                 <h1 className='text-2xl sm:text-4xl font-alfa-slab-one'>SHOPSY</h1>
               </Link>
            </div>
         
    
          <div className="flex items-center space-x-2">
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="focus:outline-none">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user?.avatar || "https://github.com/shadcn.png"} />
                        <AvatarFallback>
                         {user.user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-44 p-2">
                      <div className="flex flex-col w-28 space-y-1 text-sm">
                        <NavigationMenuLink onClick={() => setOpenDialog(true)} className="cursor-pointer">
                          Add Product
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/dashboard">Dashboard</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink onClick={logOutUser} className="cursor-pointer">
                          Logout
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <div className="flex sm:flex-row gap-2 w-full sm:w-auto">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white hover:bg-amber-100 text-gray-800 shadow shadow-amber-300 text-sm font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-amber-100 hover:bg-amber-200 text-gray-800 shadow shadow-amber-300 text-sm font-medium">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[500px] w-full">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Product</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register("name", {
                    required: "Product Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Product Price</Label>
                <Input
                  id="price"
                  type='number'
                  placeholder="Enter product price"
                  {...register("price", {
                    required: "Product Price is required",
                  })}
                  className="w-full"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Type your message here."
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                  className="min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <Controller
                name="image"
                control={control}
                rules={{ required: "Image is required" }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="file:cursor-pointer bg-amber-50 shadow shadow-zinc-300"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                    {errors.image && (
                      <p className="text-sm text-red-500">{errors.image.message}</p>
                    )}
                  </div>
                )}
              />

              <DialogFooter>
              {
            isLoading ?
              <Button className="mt-2" disabled>
                <Loader2 className="animate-spin " />
                Please Wait...
              </Button> :
              <Button  className=" mt-2 text-black bg-amber-100 font-semibold shadow-lg shadow-zinc-800 hover:bg-amber-200">Add</Button>
          }

                
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </nav>
    
    )
  }

  export default Navbar










