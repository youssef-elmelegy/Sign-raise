import prisma from "../db/connectDB.js";
import bcryptjs from "bcryptjs";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../utils/sendEmails.js";
import crypto from "crypto";
import {
  generateTokens,
  generateAccessToken,
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // Check if the user already exists
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate verification token
    const otp = crypto.randomInt(100000, 999999).toString();
    const otp_expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken: otp,
        verificationTokenExpiresAt: otp_expiration,
      },
    });

    // Generate token and set cookie
    // generateTokenAndSetCookie(res, newUser.id);

    // Send verification email
    await sendVerificationEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...newUser,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.User.findUnique({ where: { email } });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user,
        password: undefined,
      },
      token: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Fetch the user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Update the user with the reset token and expiration date
    await prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: new Date(resetTokenExpiresAt),
      },
    });

    // Send the reset password email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded || !decoded.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token payload" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }, // Use `id` instead of `userId`
    });

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user.id);
    return res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ success: false, message: error.message || "Unauthorized" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user by reset token and ensure it hasn't expired
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user || new Date(user.resetPasswordExpiresAt) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update the user's password and clear the reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // Clear the reset token
        resetPasswordExpiresAt: null, // Clear the expiration date
      },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    // Fetch the user by ID
    const user = await prisma.User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if the old password is correct
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in changePassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // Fetch the user using the verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: code,
      },
    });

    // Check if the user exists and if the verification token is not expired
    if (!user || new Date(user.verificationTokenExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Update the user to mark them as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Clear the verification token
        verificationTokenExpiresAt: null, // Clear the expiration date
      },
    });

    // Send welcome email
    await sendWelcomeEmail(updatedUser.email, updatedUser.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...updatedUser,
        password: undefined, // Exclude password from the response
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch the user using the email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Generate verification token
    const otp = crypto.randomInt(100000, 999999).toString();
    const otp_expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update the user with the new verification token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: otp,
        verificationTokenExpiresAt: otp_expiration,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.log("error in resendVerificationEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const chechAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
