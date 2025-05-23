import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/index.js";
import cors from "cors";
import usersRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/products.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js";
import cookieParser from "cookie-parser";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/auth", usersRoutes);
app.use("/api/v1/order", ordersRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
