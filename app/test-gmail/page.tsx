"use client";

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import GradientButton from '../components/ui/GradientButton';
import toast from "react-hot-toast";

export default function TestGmailPage() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "Test Email from DissertScaffold",
    body: "This is a test email to verify Gmail API integration is working correctly."
  });
  const [isLoading, setIsLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/test-gmail');
      const data = await response.json();
      setConfigStatus(data);
      
      if (data.configured) {
        toast.success("Gmail API is configured!");
      } else {
        toast.error(`Gmail API not configured. Missing: ${data.missing?.join(', ')}`);
      }
    } catch (error) {
      toast.error("Failed to check configuration");
      console.error(error);
    }
  };

  const sendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/test-gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Test email sent successfully! Message ID: ${data.messageId}`);
      } else {
        toast.error(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      toast.error("Failed to send test email");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Gmail API Test
        </h1>

        {/* Configuration Status */}
        <div className="mb-6">
          <GradientButton
            onClick={checkConfiguration}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Check Gmail Configuration
          </GradientButton>
          
          {configStatus && (
            <div className={`mt-3 p-3 rounded-md ${
              configStatus.configured 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                configStatus.configured ? 'text-green-800' : 'text-red-800'
              }`}>
                {configStatus.message}
              </p>
              {configStatus.missing && (
                <p className="text-xs text-red-600 mt-1">
                  Missing: {configStatus.missing.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Test Email Form */}
        <form onSubmit={sendTestEmail} className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">
              To Email
            </label>
            <input
              type="email"
              id="to"
              required
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="your-email@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Message Body
            </label>
            <textarea
              id="body"
              required
              rows={4}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <GradientButton
            type="submit"
            disabled={isLoading}
            variant="success"
            size="lg"
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Test Email"}
          </GradientButton>
        </form>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Setup Instructions:</h3>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>Go to Google Cloud Console</li>
            <li>Enable Gmail API</li>
            <li>Create OAuth2 credentials</li>
            <li>Get refresh token</li>
            <li>Add credentials to .env.local</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
