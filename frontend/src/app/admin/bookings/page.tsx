'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { mockAgencyBookings } from '@/lib/mockData';

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  const bookings = mockAgencyBookings;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Global Bookings</h1>
          <p className="text-sm text-muted">Oversight of all platform transactions</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-hover/50 border-b border-border">
            <tr><th className="p-4 font-medium text-muted">ID</th><th className="p-4 font-medium text-muted">Trip</th><th className="p-4 font-medium text-muted">User</th><th className="p-4 font-medium text-muted">Amount</th><th className="p-4 font-medium text-muted">Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b border-border hover:bg-surface-hover/30">
                <td className="p-4 font-mono text-xs text-muted">{b._id.toUpperCase()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {b.trip.images && b.trip.images[0] ? <img src={b.trip.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" /> : null}
                    <div><p className="font-medium max-w-[150px] truncate">{b.trip.title}</p></div>
                  </div>
                </td>
                <td className="p-4"><p className="font-medium">{b.userName}</p><p className="text-xs text-muted">{b.userEmail}</p></td>
                <td className="p-4 font-bold">₹{b.totalPrice}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-surface-hover text-xs uppercase font-bold">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}