import express from "express";
import { addFriend, login, signup, updateUser } from "../controllers/auth.js";
const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/signup", signup);
router.put("/auth/update", updateUser);
router.put("/auth/friends/:user_id",addFriend);

export default router;
