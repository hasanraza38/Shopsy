"use client"

import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import Navbar from 'components/navbar'
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from 'components/ui/button'
import Image from 'next/image'
import Footer from 'components/footer'
import Link from 'next/link'
import ProductCardSkeleton from 'components/productSkeleton'
import { api } from 'helper/api'
import HomePageCarousel from 'components/carousel'

type Product = {
  _id: string
  name: string
  description: string
  price: number
  image: string
  userId: {
    _id: string
    username: string
    email: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}



const Home = () => {
  const [data, setdata] = useState<Product[] | []>([])
  const [isloading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)


  const cactegoriesArr = [
    {
      image: "/bike.png",
      name: "Bikes"
    },
    {
      image: "/property.png",
      name: "Property"
    },
    {
      image: "/vehicle.png",
      name: "Vehicles"
    },
    {
      image: "/books.png",
      name: "Books"
    },
    {
      image: "/phone.png",
      name: "Mobile Phones"
    }
  ]




  useEffect(() => {
    fetchProducts()
  }, [])


  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await api.get("/product/getallproducts")
      console.log(res.data.products);
      setdata(res.data.products)
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage || "Please check your information and try again.")
        }
        else if (error.response.status === 404) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage)
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

    }
    finally {
      setIsLoading(false)
    }


  }

  return (
    <>
      <Navbar />

        {/* Carousel */}
      <div className='ml-13 mr-13'>
        <HomePageCarousel/>
      </div>
        {/* Carousel */}

      <div className='ml-5 mr-5'>

        {/* all categories */}
        <div>
          <h1 className='text-lg sm:text-2xl font-semibold'>All Categories</h1>

          <div className='mt-3 overflow-x-auto sm:overflow-x-visible'>
            <div className='flex sm:flex-wrap flex-nowrap gap-4 sm:justify-center sm:items-center px-2'>
              {cactegoriesArr.map((item, index) => (
                <div key={index} className='flex-shrink-0 flex flex-col items-center justify-center'>
                  <Avatar className="size-24">
                    <AvatarImage src={item.image} alt={item.name || "image"} />
                    <AvatarFallback>
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className='text-center'>{item.name}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* all categories */}


        {/* all products */}
        <div className='mt-3'>
          <h1 className='text-lg sm:text-2xl font-semibold'>Featured Products</h1>

          <div className="flex justify-center items-center mt-2 rounded-2xl flex-wrap gap-4 sm:gap-6 bg-amber-100 p-4 sm:p-6 md:p-10">

            {isloading ? (

              <div className="flex flex-wrap justify-center gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>

            ) : apiError ? (
              <div className="flex justify-center items-center min-h-[60vh] w-full">
                <h1 className="text-red-500">{apiError}</h1>
              </div>
            ) : data && data.length > 0 ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {data.map((item) => (
                  <Card
                    key={item._id}
                    className="w-full max-w-sm mx-auto shadow-gray-800 shadow-lg"
                  >
                    <CardHeader>
                      <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden rounded-xl">
                        <Image
                          src={item.image || "/placeholder.svg?height=600&width=600"}
                          fill
                          className="object-cover"
                          alt="Product Image"
                        />
                      </div>
                      <CardTitle className="mt-2">{item.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {item.description.charAt(0).toUpperCase() + item.description.slice(1, 60)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent />
                    <CardFooter className="flex justify-between">
                      <Button asChild>
                        <Link href={`/product/${item._id}`}>Order Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

            ) : (
              <div className="text-center py-8 w-full">
                <p className="text-gray-400">No featured products found.</p>
              </div>
            )}

          </div>


        </div>
        {/* all products */}

      </div>



      <Footer />

    </>
  );


}

export default Home





