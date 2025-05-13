const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const deliveryReceiptRoutes = require("./routes/delivery-receipt");
const campaignRoutes = require("./routes/campaign");
const {authenticateJWT} = require('./middlewares/auth');
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use(cors());
app.use(bodyParser.json());

//15 minutes 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use((req,res,next)=>{
   if(req.path==="/api/delivery-receipt"){
     return next();
    }
    limiter(req,res,next);
  });
  
  
  mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  
  app.use("/api/customers", authenticateJWT, customerRoutes);
  app.use("/api/orders", authenticateJWT, orderRoutes);
  app.use("/api/delivery-receipt", deliveryReceiptRoutes);
  app.use("/api/campaign", authenticateJWT, campaignRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});