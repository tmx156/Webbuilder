import React from 'react';
import { Link } from 'wouter';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/60 rounded-3xl shadow-xl p-8 backdrop-blur-md border border-white/30">
        <h1 className="text-3xl font-serif font-bold text-black mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4 text-black text-center">Your privacy is important to us. This Privacy Policy explains how LevelOneTalent collects, uses, and protects your personal information.</p>
        <div className="space-y-6 text-black">
          <div>
            <h2 className="font-bold text-lg mb-1">1. Information We Collect</h2>
            <ul className="list-disc ml-6">
              <li>Personal details you provide when applying (name, email, age, gender, etc.)</li>
              <li>Photographs and portfolio images you upload</li>
              <li>Communications sent to us via email or forms</li>
              <li>Technical data such as IP address, browser type, and device information</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">2. How We Use Your Information</h2>
            <ul className="list-disc ml-6">
              <li>To process your application and communicate with you</li>
              <li>To match talent with opportunities and clients</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">3. Data Security</h2>
            <p>We use industry-standard security measures to protect your data. Access to your information is restricted to authorized staff only. We do not sell your personal data to third parties.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">4. Cookies</h2>
            <p>We may use cookies to enhance your experience on our website. You can disable cookies in your browser settings if you prefer.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">5. Your Rights</h2>
            <ul className="list-disc ml-6">
              <li>You can request access to or deletion of your personal data at any time</li>
              <li>You can opt out of marketing communications</li>
              <li>Contact us for any privacy-related requests</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">6. Contact</h2>
            <p>If you have any questions about this Privacy Policy or your data, please email us at <a href="mailto:Info@levelonetalent.co.uk" className="underline">Info@levelonetalent.co.uk</a>.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/">
            <a className="inline-flex items-center px-4 py-2 rounded-full bg-[#fbeee6] text-[#8B3A3A] font-semibold shadow hover:bg-[#f7d9c4] transition">
              <span className="mr-2">&#8592;</span> Back Home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
} 