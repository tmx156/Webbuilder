import React from 'react';
import { Link } from 'wouter';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/60 rounded-3xl shadow-xl p-8 backdrop-blur-md border border-white/30">
        <h1 className="text-3xl font-serif font-bold text-black mb-6 text-center">Frequently Asked Questions</h1>
        <p className="mb-4 text-black text-center">Find answers to common questions about LevelOneTalent.</p>
        <div className="space-y-6 text-black">
          <div>
            <h2 className="font-bold text-lg">How do I apply to become a model?</h2>
            <p>Simply fill out the sign-up form on our homepage. Our team will review your application and get in touch if you are shortlisted.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">Is there a registration fee?</h2>
            <p>No, there are no registration fees to join LevelOneTalent.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">How do I contact you?</h2>
            <p>You can email us at <a href="mailto:Info@levelonetalent.co.uk" className="underline">Info@levelonetalent.co.uk</a> for general inquiries, <a href="mailto:bookings@levelonetalent.co.uk" className="underline">bookings@levelonetalent.co.uk</a> for bookings, and <a href="mailto:Press@levelonetalent.co.uk" className="underline">Press@levelonetalent.co.uk</a> for press.</p>
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