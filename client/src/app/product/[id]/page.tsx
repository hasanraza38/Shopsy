"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api, placeOrder } from "@/helper/api"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Product {
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

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { id } = use(props.params);


    useEffect(() => {
        fetchProduct()
    }, [id])

    const handleBuyNow = async () => {
        // console.log(id);
        await placeOrder(id)
    }


    const fetchProduct = async () => {
        try {
            const res = await api.get(`/product/getsingleproduct/${id}`)
            // console.log(res.data);
            setProduct(res.data)
        }
        catch (err: any) {
            setError(err.message || "Failed to fetch product details")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-gray-400">{error || "Product not found"}</p>
                <Button onClick={() => router.push("/")} className="mt-6">
                    Back to Home
                </Button>
            </div>
        )
    }

    return (
        <>
            <Navbar />

            <div className="flex justify-start mt-10 ml-5">
                <Button variant="ghost" className="text-2xl font-bold hover:bg-gray-800" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>
            </div>

            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
                <Card className="shadow-2xl shadow-gray-700 bg-amber-100 overflow-hidden rounded-2xl w-full max-w-4xl">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative aspect-square">
                                <Image
                                    src={product.image || "/placeholder.svg?height=600&width=600"}
                                    alt={product.name}
                                    width={500}
                                    height={300}
                                    className="object-cover rounded-xl border border-gray-800 w-full h-full"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            <div className="p-4 flex flex-col justify-between min-h-0">
                                <div>
                                    <div className="mb-3">
                                        <h2 className="text-xl font-bold underline mb-1">Product Name:</h2>
                                        <p className="text-lg font-semibold capitalize">{product.name}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h2 className="text-xl font-bold underline mb-1">Price:</h2>
                                        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h2 className="text-xl font-bold underline mb-1">Description:</h2>
                                        <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                                    </div>
                                </div>

                                <div>
                                    <Separator className="my-3 bg-gray-800" />

                                    <div className="flex items-center gap-2 mb-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={product.image || "https://github.com/shadcn.png"} />
                                            <AvatarFallback>{product.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-gray-500">Sold by {product.userId.username}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button className="flex-1 bg-white text-black" onClick={handleBuyNow}>
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Order Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>



            <Footer />
        </>

    )
}

