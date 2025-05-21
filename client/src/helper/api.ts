import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

export const api = axios.create({
  // baseURL: 'https://shopsy-production-a855.up.railway.app/api/v1',
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true
});


export const placeOrder = async (product :string) =>{
 const stripe:any = await loadStripe(
      "pk_test_51QbqY7CA9jwoGPd7goxDbS2A8YUl87VysLCHcKLD5V8kKhEspwNFSvmlaR2XLnXZ3J4dZkZeiNRrMKWqrWw9qKA800PjV1u2xN"
    );

     const response = await api.post("order/placeorder",{ products: [product]})
    //   console.log(response.data)
   const { id: sessionId } = response.data;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Stripe redirect error:", error);
    }
}


export const checkAuth = async () => {
  try {
    const res = await api.get("/auth/authorizeuser");
    const status = res.status
    if (status == 401 || status == 404) {

      return null;
        }
    return res.data;
  } catch (error: any) {
    if (error.response.status == 401) {
      const res = await refreheshToken()
      if (res == true) {
        window.location.reload()
      }
    }
    return null;
  }
};


export const logOut = async () => {
try {
  const res = await api.get("/auth/logout")
  return res.data
}
catch (error : any) {

  console.log(error);
  if (error.response) {
    if (error.response.status === 401) {
      const errorMessage = error.response.data.message || error.response.data.error
      return errorMessage
    }
    else {
      const errorMessage = error.response.data.message || "Server error. Please try again later"
      return errorMessage
    } 
  } else if (error.request) {
    const errorMessage="No response from server. Please check your internet connection and try again later"
    return errorMessage
  } else {
   const errorMessage= "An error occurred. Please try again."
   return errorMessage
  }

}
}


export const refreheshToken = async () => {
  try {
    const response = await api.post('/auth/refreshtoken');
    console.log("token refreshed",response.data.message); 
    return true;
  } catch (error :any) {
    // console.error('Error refreshing token:', error.response?.data || error.message);
    return false;
  }
}