'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiSearch, FiCheck, FiX, FiEye } from 'react-icons/fi';

export default function AdminAgenciesPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agency Management</h1>
          <p className="text-sm text-muted">Approve and monitor travel agencies</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Search agencies..." className="pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">A{i}</div>
              <div>
                <h3 className="font-bold">Agency {i}</h3>
                <p className="text-xs text-muted">contact@agency{i}.com</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-surface-hover"><p className="text-xs text-muted">Trips</p><p className="font-bold">12</p></div>
              <div className="p-3 rounded-lg bg-surface-hover"><p className="text-xs text-muted">Revenue</p><p className="font-bold">₹2.4L</p></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-teal/10 text-teal text-xs font-bold hover:bg-teal/20 transition-all">Approve</button>
              <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}