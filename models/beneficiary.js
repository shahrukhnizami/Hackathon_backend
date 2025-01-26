import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nic: { type: String, required: true, unique: true },
    department: {
      type: String,
      required: true,
      enum: ['Medical', 'Rozgar', 'Job'], // Enforce valid department values
    },
    number: { type: Number, required: true }, // Corrected to 'Number' (capitalized)
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model('beneficiary', BeneficiarySchema);
