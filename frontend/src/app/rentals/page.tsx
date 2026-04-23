'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
// import { mockRentals } from '@/lib/mockData';
import { mockAgencyRentals as mockRentals } from '@/lib/mockData';

const TYPES = ['all', 'bike', 'scooty', 'car', 'gopro'];
const typeEmoji: Record<string, string> = { bike: '🏍️', scooty: '🛵', car: '🚗', gopro: '📷' };

export default function RentalsPage() {
  const [type, setType] = useState('all');
  const filtered = type === 'all' ? mockRentals : mockRentals.filter(r => r.type === type);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Travel Rentals</h1>
          <p className="text-muted mt-2">Rent bikes, cars, and cameras for your trip</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                type === t ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-surface-hover'}`}>
              {t === 'all' ? '🌐 All' : `${typeEmoji[t]} ${t}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rental, idx) => (
            <motion.div key={rental._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
  <img
    src={rental.images[0]}
    alt={rental.name}
    className="w-full h-full object-cover"
  />
                {!rental.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{rental.type}</span>
                  <span className="flex items-center gap-1 text-xs text-muted"><FiMapPin size={12} /> {rental.location}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{rental.name}</h3>
                <p className="text-sm text-muted mb-3">{rental.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rental.features.map(f => (
                    <span key={f} className="px-2 py-0.5 rounded bg-surface-hover text-xs text-muted">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{rental.pricePerDay.toLocaleString()}</span>
                    <span className="text-xs text-muted"> /day</span>
                  </div>
                  <button disabled={!rental.available}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50 hover:bg-primary-dark transition-all">
                    Rent Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
