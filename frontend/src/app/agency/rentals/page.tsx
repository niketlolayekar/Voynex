'use client';
import React from 'react';
import { FiTruck, FiPlus } from 'react-icons/fi';
import { mockAgencyRentals } from '@/lib/mockData';

export default function AgencyRentalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rental Management</h1>
          <p className="text-sm text-muted">Manage your rentable inventory</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-xl text-sm font-medium hover:opacity-90"><FiPlus/> Add Rental</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAgencyRentals.map(r => (
          <div key={r._id} className="p-4 rounded-2xl border border-border bg-card flex gap-4 items-center">
            {r.images && r.images[0] ? <img src={r.images[0]} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 rounded-xl bg-surface-hover flex items-center justify-center text-2xl">{r.type==='bike'?'🏍️':r.type==='car'?'🚗':'📷'}</div>}
            <div>
              <h3 className="font-bold">{r.name}</h3>
              <p className="text-xs text-muted">₹{r.pricePerDay}/day</p>
              <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${r.available?'bg-teal/10 text-teal':'bg-red-500/10 text-red-500'}`}>{r.available?'Available':'Out'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}