'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { mockRentals } from '@/lib/mockData';
import Breadcrumbs from '@/components/Breadcrumbs';

const TYPES = ['all', 'bike', 'scooty', 'car', 'gopro'];
const typeEmoji: Record<string, string> = { bike: '🏍️', scooty: '🛵', car: '🚗', gopro: '📷' };

export default function RentalsPage() {
  const [type, setType] = useState('all');
  const filtered = type === 'all' ? mockRentals : mockRentals.filter(r => r.type === type);

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Travel Rentals</h1>
          <p className="text-muted mt-2">Rent bikes, cars, and cameras for your trip</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all tap-target ${
                type === t ? 'bg-accent text-white' : 'bg-card border border-border hover:bg-surface-hover'}`}>
              {t === 'all' ? '🌐 All' : `${typeEmoji[t]} ${t}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rental, idx) => (
            <motion.div key={rental._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover-glow transition-all duration-300">
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700/50 dark:to-gray-800/50 relative flex items-center justify-center text-6xl img-dark-overlay">
                {typeEmoji[rental.type]}
                {!rental.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium capitalize">{rental.type}</span>
                  <span className="flex items-center gap-1 text-xs text-muted"><FiMapPin size={12} /> {rental.location}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">{rental.name}</h3>
                <p className="text-sm text-muted mb-3">{rental.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rental.features.map(f => (
                    <span key={f} className="px-2 py-0.5 rounded bg-surface-hover text-xs text-muted">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-accent">₹{rental.pricePerDay.toLocaleString()}</span>
                    <span className="text-xs text-muted"> /day</span>
                  </div>
                  <button disabled={!rental.available}
                    className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 hover:bg-accent-dark transition-all tap-target">
                    Rent Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold">No rentals found</p>
            <p className="text-muted mt-2">Try a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
