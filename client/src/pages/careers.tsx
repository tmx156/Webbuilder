import React from 'react';
import { Link } from 'wouter';

export default function Careers() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/60 rounded-3xl shadow-xl p-8 backdrop-blur-md border border-white/30">
        <h1 className="text-3xl font-serif font-bold text-black mb-6 text-center">Careers at LevelOneTalent</h1>
        <p className="mb-4 text-black text-center">We're always looking for passionate people to join our team. Check back soon for job openings or email your CV to <a href="mailto:Info@levelonetalent.co.uk" className="underline">Info@levelonetalent.co.uk</a>.</p>
        <div className="space-y-4 text-black">
          <h2 className="font-bold text-lg">Current Opportunities</h2>
          <p>[No open positions at this time. Please check back later!]</p>
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