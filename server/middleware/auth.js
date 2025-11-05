// middleware/auth.js
import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();  // ← FUNCTION, not property
    console.log("protectAdmin: req.auth() =", auth);

    const userId = auth?.userId;
    if (!userId) {
      console.log("No userId → 401");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    console.log("Metadata:", user.privateMetadata);

    if (user.privateMetadata?.role !== "admin") {
      return res.status(403).json({ success: false, message: "not authorized" });
    }

    console.log("ADMIN ACCESS GRANTED");
    next();
  } catch (error) {
    console.error("protectAdmin error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};