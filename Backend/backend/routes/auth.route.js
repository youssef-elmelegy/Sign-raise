import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  chechAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 format: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 format: password
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User created successfully
 *               user:
 *                 id: "0a8d4830-81a2-4a4b-bde6-b0890df91ca1"
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *                 lastLogin: "2025-03-14T23:28:20.911Z"
 *                 isVerified: false
 *                 resetPasswordToken: null
 *                 resetPasswordExpiresAt: null
 *                 verificationToken: "748330"
 *                 verificationTokenExpiresAt: "2025-03-14T23:38:20.910Z"
 *                 createdAt: "2025-03-14T23:28:20.911Z"
 *                 updatedAt: "2025-03-14T23:28:20.911Z"
 *       400:
 *         description: Bad request
 */
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", verifyToken, changePassword);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);

router.get("/check-auth", verifyToken, chechAuth);

export default router;
