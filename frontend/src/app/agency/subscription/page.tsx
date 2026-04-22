'use client';
import React from 'react';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export default function AgencySubscriptionPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Your Subscription</h1>
        <p className="text-muted mt-2">You are currently on the <span className="text-primary font-bold">Pro Plan</span>.</p>
      </div>
      <div className="p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-teal/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4"><span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">ACTIVE</span></div>
        <h2 className="text-2xl font-bold mb-6">Pro Plan Features</h2>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3"><FiCheckCircle className="text-teal"/> Up to 15 Active Trips</li>
          <li className="flex items-center gap-3"><FiCheckCircle className="text-teal"/> Unlimited Bookings</li>
          <li className="flex items-center gap-3"><FiCheckCircle className="text-teal"/> Advanced Analytics</li>
          <li className="flex items-center gap-3"><FiCheckCircle className="text-teal"/> Team Management (Up to 5)</li>
        </ul>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg transition-all">Upgrade to Premium</button>
          <button className="px-6 py-3 rounded-xl border border-border hover:bg-surface-hover font-bold transition-all">Manage Billing</button>
        </div>
      </div>
    </div>
  );
}