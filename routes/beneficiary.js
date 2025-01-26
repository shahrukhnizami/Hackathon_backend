import express from 'express';
import Beneficiary from '../models/beneficiary.js'; // Import the Beneficiary model
import crypto from 'crypto';

const router = express.Router();

// Utility function to generate a random token
const generateToken = () => crypto.randomBytes(5).toString('hex');

// CREATE a new Beneficiary
router.post('/', async (req, res) => {
  try {
    const { name, nic, department,number } = req.body;

    // Validate required fields
    if (!name || !nic) {
      return res.status(400).json({ message: 'Name and NIC are required' });
    }

    // Generate a unique token for the beneficiary
    const token = generateToken();
    console.log("token>",token);
    

    // Create new beneficiary
    const newBeneficiary = new Beneficiary({ name, nic, department,number, token });
    const savedBeneficiary = await newBeneficiary.save();

    res.status(201).json(savedBeneficiary);
  } catch (error) {
    // Handle unique NIC validation errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'NIC must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
});

// READ all Beneficiaries
router.get('/', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ a single Beneficiary by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const beneficiary = await Beneficiary.findById(id);

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.status(200).json(beneficiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a Beneficiary by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBeneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.status(200).json(updatedBeneficiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a Beneficiary by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBeneficiary = await Beneficiary.findByIdAndDelete(id);

    if (!deletedBeneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.status(200).json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
