// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Trash2 } from "lucide-react";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState<any[]>([]);

//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }

//     // const updateQuantity = (index: number, quantity: number) => {
//     //   if (quantity < 1) return;
//     //   const updatedCart = [...cartItems];
//     //   updatedCart[index].quantity = quantity;
//     //   updatedCart[index].totalPrice = updatedCart[index].price * quantity;
//     //   setCartItems(updatedCart);
//     //   localStorage.setItem("cart", JSON.stringify(updatedCart));
//     // };

    
//   }, []);

//   const updateQuantity = (index: number, quantity: number) => {
//     if (quantity < 1) return;
//     const updatedCart = [...cartItems];
//     updatedCart[index].quantity = quantity;
//     updatedCart[index].totalPrice = updatedCart[index].price * quantity;
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const removeItem = (index: number) => {
//     const updatedCart = cartItems.filter((_, i) => i !== index);
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const handleCheckout = () => {
//     alert("Proceeding to checkout...");
//     navigate("/checkout");
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div className="grid gap-4">
//           {cartItems.map((item, index) => (
//             <Card key={index}>
//               <CardHeader>
//                 <CardTitle>{item.name}</CardTitle>
//               </CardHeader>
//               <CardContent className="flex items-center justify-between">
//                 <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
//                 <p className="text-lg font-semibold">${item.totalPrice || item.price}</p>
//                 <Input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
//                   className="w-16"
//                 />
//                 <Button variant="destructive" onClick={() => removeItem(index)}>
//                   <Trash2 />
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//           <Button className="w-full mt-4" onClick={handleCheckout}>
//             Checkout
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;
