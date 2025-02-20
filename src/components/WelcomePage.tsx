import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface WelcomePageProps {
  user: User;
  onSignOut: () => void;
}

export function WelcomePage({ user, onSignOut }: WelcomePageProps) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending...");
  
    const form = event.target as HTMLFormElement; // ✅ Cast to HTMLFormElement
    const formData = new FormData(form);
    formData.append("access_key", process.env.REACT_APP_WEB3FORMS_KEY || "");
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("✅ Form Submitted Successfully!");
        form.reset(); // ✅ No more TypeScript errors
      } else {
        setResult(`❌ ${data.message || "Submission failed."}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`⚠️ Error: ${error.message}`);
      } else {
        setResult("⚠️ An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <button
            onClick={onSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow-md"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user.user_metadata.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Registration Number: {user.user_metadata.registration_number}
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                value={user.user_metadata.name}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="Enter Your Phone Number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registered Number</label>
              <input
                type="text"
                name="registered_number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                value={user.user_metadata.registration_number}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message (Reason)</label>
              <textarea
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="Enter Your Message"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Now"}
            </button>
          </form>
          <span className="block mt-4 text-center text-sm text-gray-700">{result}</span>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
