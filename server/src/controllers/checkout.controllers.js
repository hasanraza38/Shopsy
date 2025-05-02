import Stripe from "stripe";

const stripe = new Stripe(
  
    process.env.SECRET_KEY || 'api_key_placeholder'
);

const checkout = async (req, res) => {
    const { products } = req.body;

    const lineItems = products.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://shopsy1.vercel.app/success",
      cancel_url: "https://shopsy1.vercel.app/cancel",
    });
  
    res.json({ message: "session completed", id: session.id, products });
}

export {checkout}