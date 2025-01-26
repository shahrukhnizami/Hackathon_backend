import { register, login, forgetPassword, logout, getAlluser , deleteUser,updateUser  } from "../controllers/authController.js";
import express from 'express'


const router = express.Router();


import jwt from "jsonwebtoken";

const secretKey = "your_secret_key";

// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey); // Validate token using secret key
      req.user = decoded; // Attach decoded token data to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.', error });
    }
  };
  

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
  

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/logout", logout);
router.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);
router.put('/users/:id', isAuthenticated, isAdmin, updateUser);

// Route to get all users
router.get("/users" , isAuthenticated , isAdmin, getAlluser);

export const registerUser = async (req, res) => {
  console.log("Received request:", req.body); // Log the incoming request
  const { name, email, password, role } = req.body;
  const image = req.file ? req.file.path : ''; // Get image path from Cloudinary

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Your existing logic...
};

export default router;
