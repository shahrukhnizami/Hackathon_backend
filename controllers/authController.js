import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import connectDB from "../config/database.js";

const secretKey = "your_secret_key";


// Cloudinary configuration


// Register User
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error });
    }
};

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid email or password." , data: [email , password] , "db" : connectDB()});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password mismatch");
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
            expiresIn: "1h",
        });

        console.log("Login successful");
        res.status(200).json({
            message: "Login successful.",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role ,image: user.image},
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in.", error });
    }
};


// Forget Password
export const forgetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating password.", error });
    }
};

// Logout User
export const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully." });
};

// Get All Users
export const getAlluser = async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password field for security
      res.status(200).json({ message: "Users retrieved successfully.", users });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users.", error });
    }
  };
  
// Delete User

  export const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      await user.deleteOne();
  
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user.', error });
    }
  };
  
  
  // Update User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user.', error });
    }
  };
  
