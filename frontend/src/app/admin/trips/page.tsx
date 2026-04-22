'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMap, FiSearch, FiTrash2, FiEyeOff } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';

export default function AdminTripsPage() {
  const [search, setSearch] = useState('');
  const trips = mockTrips;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Trips</h1>
          <p className="text-sm text-muted">Monitor all trips created by agencies</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Search trips..." className="pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-hover/50 border-b border-border">
            <tr><th className="p-4 font-medium text-muted">Trip</th><th className="p-4 font-medium text-muted">Agency</th><th className="p-4 font-medium text-muted">Price</th><th className="p-4 font-medium text-muted text-right">Actions</th></tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t._id} className="border-b border-border hover:bg-surface-hover/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {t.images && t.images[0] ? <img src={t.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-surface-hover" />}
                    <div><p className="font-medium">{t.title}</p><p className="text-xs text-muted">{t.destination}</p></div>
                  </div>
                </td>
                <td className="p-4 text-muted">{t.agency.name}</td>
                <td className="p-4 font-medium text-primary">₹{t.price}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <button className="p-1.5 text-muted hover:text-orange"><FiEyeOff size={16}/></button>
                  <button className="p-1.5 text-muted hover:text-red-500"><FiTrash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}