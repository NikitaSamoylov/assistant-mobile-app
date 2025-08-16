import mongoose from "mongoose";

const { Schema } = mongoose;

const backupSchema = new Schema(
  {
    userId: { type: String },
    backup: {
      existingProducts: [
        {
          title: { type: String },
          img: String,
          expiredDate: String,
          createdAt: String,
          updatedAt: String,
          _id: String,
        },
      ],
      toBuyProducts: [
        {
          title: { type: String },
          addedAt: String,
          isBought: Boolean,
          _id: String,
        },
      ],
    }
  },
  { timestamps: true }
);

export default mongoose.models.Backup ||
  mongoose.model("Backup", backupSchema);
