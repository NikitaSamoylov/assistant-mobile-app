import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  userName: { type: String },
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  emailForChange: { type: String },
  phoneForChange: { type: String },
  timezone: { type: String },
  expired: { type: String },
  tariff: { type: String },
  timeToNotify: { type: String },
  isLogged: { type: Boolean },
  nextTariff: { type: String },
  isNextTariffPayed: { type: Boolean },
  pushSubscription: {
    endpoint: { type: String },
    expirationTime: { type: String },
    keys: {
      p256dh: { type: String },
      auth: { type: String }
    },
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);