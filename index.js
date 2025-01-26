import express from 'express'





import connectDB from './config/database.js';

import userRoute from "./routes/authRoutes.js";
import BeneficiaryRoute from "./routes/beneficiary.js";
import cors from "cors";
const app = express();
// Allow CORS
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    // origin: "frontend-rms.vercel.app", // Replace with your frontend's URL
    // origin: "https://frontend-fbx38u5yl-shahrukhs-projects-ff5f4f54.vercel.app", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // If you're using cookies or authentication headers
  })
);


// const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRoute);
app.use("/api/beneficiary", BeneficiaryRoute);


app.get("/" , (req, res)=>{
  res.send("sever running")
})

// Start Server
const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
