import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Create transporter
const createTransporter = (): Transporter => {
  // For development, use a simple test configuration that won't fail
  if (process.env.NODE_ENV !== "production") {
    // Use nodemailer's test account for development
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
      // Ignore TLS errors in development
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // For production, use your preferred email service
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  firstName?: string
) => {
  // In development, just log the verification URL instead of sending email
  if (process.env.NODE_ENV !== "production") {
    const verificationUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/verify-email?token=${verificationToken}`;
    console.log("🔗 Email Verification URL for", email, ":", verificationUrl);
    console.log("📧 In development mode - check console for verification link");
    return { success: true, messageId: "dev-mode" };
  }

  const transporter = createTransporter();

  const verificationUrl = `${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - DissertScaffold</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎓 DissertScaffold</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Academic Research Platform</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Welcome${
          firstName ? ` ${firstName}` : ""
        }! 🚀</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Thank you for joining our academic research community. To complete your registration and start your research journey, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ✅ Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
          ${verificationUrl}
        </p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
          <p style="font-size: 14px; color: #666; margin: 0;">
            <strong>Security Note:</strong> This verification link will expire in 24 hours for your security.
          </p>
          <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2024 DissertScaffold. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to DissertScaffold${firstName ? ` ${firstName}` : ""}!

Thank you for joining our academic research community. To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 24 hours for your security.

If you didn't create an account with us, please ignore this email.

© 2024 DissertScaffold. All rights reserved.
  `;

  const mailOptions = {
    from: `"DissertScaffold" <${
      process.env.SMTP_FROM || "noreply@dissertscaffold.com"
    }>`,
    to: email,
    subject: "🎓 Verify Your Email - Welcome to DissertScaffold!",
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);

    // Log preview URL for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  firstName?: string
) => {
  // In development, just log the reset URL instead of sending email
  if (process.env.NODE_ENV !== "production") {
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;
    console.log("🔗 Password Reset URL for", email, ":", resetUrl);
    console.log("📧 In development mode - check console for reset link");
    return { success: true, messageId: "dev-mode" };
  }

  const transporter = createTransporter();

  const resetUrl = `${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - DissertScaffold</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎓 DissertScaffold</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Academic Research Platform</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request 🔐</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Hi${
            firstName ? ` ${firstName}` : ""
          }, we received a request to reset your password. Click the button below to create a new password.
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            🔑 Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
          ${resetUrl}
        </p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
          <p style="font-size: 14px; color: #666; margin: 0;">
            <strong>Security Note:</strong> This reset link will expire in 1 hour for your security.
          </p>
          <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
            If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2024 DissertScaffold. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Password Reset Request - DissertScaffold

Hi${
    firstName ? ` ${firstName}` : ""
  }, we received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This reset link will expire in 1 hour for your security.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

© 2024 DissertScaffold. All rights reserved.
  `;

  const mailOptions = {
    from: `"DissertScaffold" <${
      process.env.SMTP_FROM || "noreply@dissertscaffold.com"
    }>`,
    to: email,
    subject: "🔑 Reset Your Password - DissertScaffold",
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);

    // Log preview URL for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const generateVerificationToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
};

export const isValidEduNgEmail = (email: string): boolean => {
  return email.toLowerCase().includes("edu.ng");
};
