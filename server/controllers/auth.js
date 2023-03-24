import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secret = "Chat App";
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(500).json({error:"Account doesn't exist"});
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const friendsId = user.friends;
        let friends = [];
        if (friendsId.length > 0) {
          friends = Array(friendsId.length);
          for (let i = 0; i < friendsId.length; i++) {
            friends[i] = await User.findById(friendsId[i]);
          }
          friends = friends.map((friend) => {
            return {
              _id: friend.id,
              name: friend.name,
              email: friend.email,
              profile: friend.profile,
            };
          });
        }
        const token = jwt.sign({ email: user.email, id: user._id }, secret, {
          expiresIn: "1h",
        });
        res.status(200).json({ result: { ...user._doc, friends }, token });
      } else {
        res.status(500).json({error:"Password incorrect"});
      }
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        secret,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ result: newUser, token });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
export const updateUser = async (req, res) => {
  const { name, email, profile } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, email, profile }
    );
    const friendsId = user.friends;
    let friends = [];
    if (friendsId.length > 0) {
      friends = Array(friendsId.length);
      for (let i = 0; i < friendsId.length; i++) {
        friends[i] = await User.findById(friendsId[i]);
      }
      friends = friends.map((friend) => {
        return {
          _id: friend.id,
          name: friend.name,
          email: friend.email,
          profile: friend.profile,
        };
      });
    }
    await user.save();

    return res.status(200).json({ result: { ...user._doc, friends } });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
export const addFriend = async (req, res) => {
  const { user_id } = req.params;
  const { friend_id } = req.body;
  try {
    const user = await User.findById(user_id);
    user.friends.push(friend_id);
    await user.save();
    res.status(200).json("Friend Added");
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
