"use client"

// // import { api } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"


const Home = () => {
// const [data , setdata]:any = useState([])

//   useEffect(() => {
//     fetchProducts()
    
//   }, [])

//   const fetchProducts = async () =>{
//     const res = await api.get("/product/getallproducts")
//     console.log(res.data.products);
//     setdata(res.data.products)

//   }
return (
  <>
<div className='w-[100%]'>


<Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
      >
      <CarouselContent>
        {Array.from({ length: 5 }).map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
      {/* <div className="flex justify-center items-center m-5 flex-wrap gap-4">
        {data.length > 0 ? (
          data.map((item: any, index: number) => (
            <div key={index} className="border p-4 rounded shadow w-60">
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p>{item.description}</p>
              <p className="text-green-600 font-semibold">${item.price}</p>
              </div>
              ))
              ) : (
                <h1>Loading...</h1>
        )}
      </div> */}
    </>
  );
    
  
}

export default Home





