import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profile: {
    type: String,
    default:
      "https://res.cloudinary.com/dtveiunmn/image/upload/v1677458808/profile_w8hn3z.png",
  },
  friends: [mongoose.Types.ObjectId],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);
export default User;
