import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingCart, User } from "lucide-react";

const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1/getallproducts';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface User {
  // id: string;
  user: string;
  // name: string;
  // email: string;
}
const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); 
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
axios.get<Product[]>(API_URL) 

.then((response) => setProducts(response.data.products))
      
      .catch((error) => console.error("Error fetching products:", error));

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setCartCount(2);
    }
  }, []);

  console.log(products);
  
  const handleOrderNow = () => {
    if (user) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between p-4 bg-gray-100 shadow-md">
        <h1 className="text-xl font-bold">Shopsy</h1>
        <Input placeholder="Search products..." className="max-w-sm" />
        {user ? (
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/cart")}>
              <ShoppingCart />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <User />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/add-product")}>Add Product</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
        )}
      </nav>

      {/* Marquee */}
      <div className="marquee bg-gray-200 py-2 text-center text-sm font-medium">🔥 Hot Deals Every Day! Don't Miss Out! 🔥</div>

      {/* Carousel (Placeholder) */}
      <div className="h-40 bg-gray-300 flex items-center justify-center text-xl font-bold">Carousel</div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Card key={product._id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image && <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />}
              <p className="text-sm text-gray-600">{product.description}</p>
              <Button onClick={handleOrderNow} className="mt-2 w-full">Order Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Product Cards */}


      {/* Footer */}
      <footer className="text-center p-4 bg-gray-100">&copy; 2025 Shopsy. All Rights Reserved.</footer>
    </div>
      {/* Footer */}

);
};

export default HomePage;
