import mongoose from 'mongoose';

const RateAppSchema = new mongoose.Schema({
  rating: [
    {
      userId: { type: String },
      rate: { type: String },
      message: { type: String },
      rateDate: { type: String },
    }
  ]
});

export default mongoose.models.Rate || mongoose.model('Rate', RateAppSchema);