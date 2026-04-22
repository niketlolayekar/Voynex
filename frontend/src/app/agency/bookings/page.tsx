'use client';
import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import { mockAgencyBookings } from '@/lib/mockData';

export default function AgencyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-sm text-muted">Track all customer reservations</p>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-hover/50 border-b border-border">
            <tr><th className="p-4 font-medium text-muted">Customer</th><th className="p-4 font-medium text-muted">Trip</th><th className="p-4 font-medium text-muted">Amount</th><th className="p-4 font-medium text-muted">Status</th></tr>
          </thead>
          <tbody>
            {mockAgencyBookings.map(b => (
              <tr key={b._id} className="border-b border-border hover:bg-surface-hover/30">
                <td className="p-4"><p className="font-medium">{b.userName}</p><p className="text-xs text-muted">{b.userEmail}</p></td>
                <td className="p-4 truncate max-w-[150px]">{b.trip.title}</td>
                <td className="p-4 font-bold">₹{b.totalPrice}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-surface-hover text-[10px] uppercase font-bold">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}