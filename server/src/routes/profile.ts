import { Router } from "express";
import { UserModel, type User } from "../utils/validation.js";

const router = Router();

router.get("/profile", async (req, res) => {
  const user: User = req.body;

  const email = user.email;
  return res.json({ email });
  
});

export default router;