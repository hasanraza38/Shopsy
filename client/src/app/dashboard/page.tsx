"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/helper/api"
import { formatDate, formatTime } from "@/helper/formateDateAndTime"
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

interface Order {
  _id: string
  products: Product[]
  userId: {
    _id: string
    username: string
    email: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

type FormData = {
    _id: string;
  name: string;
  description: string;
  price: number;
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [productOrders, setProductOrders] = useState<Order[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null);
  const [productUpdated, setProductUpdated] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
    name: "",
    price: 0,
    description: "",
  },
  });


  useEffect(() => {
    fetchProducts()
  }, [productUpdated])

  useEffect(() => {
    getOrders()
    getProductOrders()
  }, [])


  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await api.get("/dashboard/products")
      // console.log(res.data.products);
      setProducts(res.data.products)
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

    } finally {
      setIsLoading(false)
    }

  }



  const getOrders = async () => {
    setIsLoading(true)

    try {
      const response = await api.get(`dashboard/myorders`)
      // console.log(response.data.orders);
      setOrders(response.data.orders)
    } catch (error: any) {
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

    } finally {
      setIsLoading(false)
    }


  }


  const getProductOrders = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`dashboard/orders`)
      // console.log(response.data.orders);
      setProductOrders(response.data.orders)


    } catch (error: any) {
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

    } finally {
      setIsLoading(false)
    }

  }



  const handleEditClick = (product: FormData) => {
    setIsEditModalOpen(true)
    setProductId(product._id)

    reset({
    name: product.name,
    price: product.price,
    description: product.description,
  });
  }
  
  const onSubmit = async (data: FormData) => {
    setApiError(null)

    if (!productId) {
      console.error("No productId found!");
      return;
    }
    // console.log(productId);

    try {
      // console.log(data);
      const response = await api.put(`dashboard/editproduct/${productId}`, data)
      toast.success("Product Updated Successfully...")
      setIsSubmitting(true)
      setProductUpdated(true)

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
      reset()
      setIsEditModalOpen(false)
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }


  const handleDeleteProduct = async (productId: string) => {
    setApiError(null)

    try {
        const res = await api.delete(`/dashboard/deleteproduct/${productId}`)
        toast("Product Deleted Successfully...")

        window.location.reload()
    } catch (error:any) {
     console.error("error:", error)

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
      setProductUpdated(false)
    }
  }







  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }



  return (
    <>
      <Navbar />
      <div className="mr-5 ml-5 mb-10">

        <Button variant="ghost" className="mb-6 mt-6 hover:bg-amber-50" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your products and view your orders</p>
        </div>


        <Tabs defaultValue="products" className="mt-2 w-full">
          <TabsList className="grid w-full grid-cols-3 bg-amber-50 shadow shadow-black">
            <TabsTrigger className="data-[state=active]:bg-amber-200 data-[state=active]:shadow-black" value="products">My Products</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-amber-200 data-[state=active]:shadow-black" value="orders">My Orders</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-amber-200 data-[state=active]:shadow-black" value="productOrders">Product Orders </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card className=" bg-amber-50 border-gray-300 shadow-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle>My Products</CardTitle>
              </CardHeader>
              <CardContent>


                {isLoading ? (
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ) : products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] font-semibold">Image</TableHead>
                        <TableHead className="font-semibold">Product Name</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="md:table-cell font-semibold">Date</TableHead>
                        <TableHead className="md:table-cell font-semibold">Time</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="relative h-12 w-12 rounded overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                            {product.description}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{formatDate(product.updatedAt)}</TableCell>
                          <TableCell>{formatTime(product.updatedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-gray-700 hover:border-neon-blue hover:text-neon-blue"
                                onClick={() => handleEditClick(product)}

                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-gray-700 hover:border-red-500 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className=" border-gray-800">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete your product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-gray-700">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={()=>handleDeleteProduct(product._id)}

                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : apiError ? (
                  <div className="flex justify-center items-center">
                    <h1 className="text-red-400">{apiError}</h1>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">You haven&apos;t added any products yet.</p>
                    <Button
                      onClick={() => router.push("/")}
                      className="mt-4 bg-transparent hover:bg-amber-100 shadow shadow-zinc-500 text-black"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="orders" className="mt-6">
            <Card className="border-gray-800 bg-amber-50 shadow shadow-black">
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>View the products you have ordered</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] font-semibold">Image</TableHead>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className=" md:table-cell font-semibold">Date</TableHead>
                        <TableHead className=" md:table-cell font-semibold">Time</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <div className="relative h-12 w-12 rounded overflow-hidden">
                              <Image
                                src={order.products[0]?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Wc-pDXUXO2V-KQh_5sQ9g5MGrAmvo3pTLA&s"}
                                alt={order.products[0]?.name || "image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{order.products[0]?.name}</TableCell>
                          <TableCell>${order.products[0]?.price?.toFixed(2)}</TableCell>
                          <TableCell className=" md:table-cell">
                            {formatDate(order?.createdAt)}
                          </TableCell>
                          <TableCell className=" md:table-cell">
                            {formatTime(order?.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                              Completed
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : apiError ? (
                  <div className="flex justify-center items-center">
                    <h1 className="text-red-400">{apiError}</h1>
                  </div>
                )
                  : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">You haven&apos;t placed any orders yet.</p>
                      <Button
                        onClick={() => router.push("/")}
                        className="mt-4 bg-neon-blue hover:bg-neon-blue/80 text-black"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Browse Products
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="productOrders" className="mt-6">
            <Card className="border-gray-800 bg-amber-50 shadow shadow-black">
              <CardHeader>
                <CardTitle>Product Orders</CardTitle>
                <CardDescription>Manage the products you have listed for sale</CardDescription>
              </CardHeader>
              <CardContent>
                {productOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] font-semibold">Image</TableHead>
                        <TableHead className="font-semibold">Product Name</TableHead>
                        <TableHead className=" md:table-cell font-semibold">Customer Name</TableHead>
                        <TableHead className=" md:table-cell font-semibold">Order Date</TableHead>
                        <TableHead className=" md:table-cell font-semibold">Time</TableHead>
                        <TableHead className="text-right font-semibold">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <div className="relative h-12 w-12 rounded overflow-hidden">
                              <Image
                                src={order.products[0]?.image}
                                alt={order.products[0]?.name || "image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{order.products[0]?.name}</TableCell>
                          <TableCell>{order.userId?.username}</TableCell>
                          <TableCell className="md:table-cell">
                            {formatDate(order?.createdAt) || 9000}
                          </TableCell>
                          <TableCell className="md:table-cell">
                            {formatTime(order?.createdAt) || 9000}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline">Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : apiError ? (
                  <div className="flex justify-center items-center">
                    <h1 className="text-red-400">{apiError}</h1>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">You haven&apos;t added any products yet.</p>
                    <Button
                      onClick={() => router.push("/")}
                      className="mt-4 bg-transparent hover:bg-amber-100 shadow shadow-zinc-500 text-black"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>



        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className=" border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Edit Product</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

              <div className="grid gap-4 py-4">


                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Product Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                    className=" border-gray-700"
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>


                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product Description"
                    {...register("description", {
                      required: "Product Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 3 characters",
                      },
                    })}

                    className=" border-gray-700 min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid gap-2">

                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type='number'
                    placeholder="Product Price"
                    {...register("price", {
                      required: "Product Price is required",
                    })}
                    className="w-full"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}

                </div>


              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>

                <Button
                 type="submit"
                 variant="success" 
                 disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer/>
    </>
  )
}
