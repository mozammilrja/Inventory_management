import mongoose, { Schema, Document, models } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  planName: string;
  userEmail?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    planName: { type: String, required: true },
    userEmail: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Payment =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;