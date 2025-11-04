import { Router } from "express";

const router = Router();

router.get("/profile", async (req, res) => {
  return res.status(200).json({ message: "Профиль успешно получен" });
});

export default router;