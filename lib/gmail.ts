import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

class GmailService {
  private oauth2Client: OAuth2Client | null = null;
  private gmail: any = null;
  private isConfigured: boolean = false;

  constructor() {
    // Check if all required environment variables are present
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/api/auth/callback/google";
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      console.error(
        "Gmail API configuration incomplete. Missing environment variables:"
      );
      if (!clientId) console.error("- GOOGLE_CLIENT_ID");
      if (!clientSecret) console.error("- GOOGLE_CLIENT_SECRET");
      if (!refreshToken) console.error("- GOOGLE_REFRESH_TOKEN");
      return;
    }

    try {
      // Initialize OAuth2 client with credentials from environment
      
      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      // Set credentials
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      // Initialize Gmail API
      this.gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
      this.isConfigured = true;

      console.log("Gmail API configured successfully");
    } catch (error) {
      console.error("Failed to configure Gmail API:", error);
    }
  }

  /**
   * Send email using Gmail API
   */
  async sendGmail(
    to: string,
    subject: string,
    body: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured || !this.gmail) {
      return {
        success: false,
        error:
          "Gmail API is not properly configured. Please check your environment variables.",
      };
    }

    try {
      // Create the email message
      const message = this.createMessage(to, subject, body);

      // Send the email
      const response = await this.gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: message,
        },
      });

      console.log("Email sent successfully:", response.data.id);
      return {
        success: true,
        messageId: response.data.id,
      };
    } catch (error: any) {
      console.error("Error sending email:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to send email";
      if (error.message?.includes("invalid_grant")) {
        errorMessage =
          "Gmail API refresh token is invalid or expired. Please regenerate your credentials.";
      } else if (error.message?.includes("insufficient authentication")) {
        errorMessage =
          "Gmail API authentication failed. Please check your credentials.";
      } else if (error.message?.includes("quota")) {
        errorMessage = "Gmail API quota exceeded. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Create base64 encoded message for Gmail API
   */
  private createMessage(to: string, subject: string, body: string): string {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      "",
      body,
    ].join("\n");

    // Encode the message in base64url format
    return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}

// Export singleton instance
export const gmailService = new GmailService();

/**
 * Send email using Gmail API
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param body - Email body (HTML supported)
 * @returns Promise with success status and message ID or error
 */
export async function sendGmail(
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return gmailService.sendGmail(to, subject, body);
}

export default gmailService;
