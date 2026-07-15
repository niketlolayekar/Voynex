'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiStar } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';
import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const GRADIENTS = [
  'from-teal-400 to-emerald-600', 'from-blue-400 to-purple-600', 'from-orange-400 to-pink-500',
];

export default function SavedTripsPage() {
  // Mock saved trips — in a real app this would come from user state
  const savedTrips = mockTrips.slice(2, 5);

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiHeart className="text-accent" /> Saved Trips
            </h1>
            <p className="text-muted mt-1">Trips you&apos;ve bookmarked for later</p>
          </motion.div>

          {savedTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip, idx) => (
                <motion.div key={trip._id} variants={fadeUp}>
                  <Link href={`/trips/${trip._id}`}
                    className="group block rounded-2xl border border-border bg-card overflow-hidden hover-glow transition-all duration-300">
                    <div className={`relative h-44 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                      <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/80 transition-all">
                        <FiHeart size={16} fill="currentColor" />
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs">
                        <FiStar size={12} fill="currentColor" /> {trip.rating}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-muted text-xs mb-1">
                        <FiMapPin size={12} /> {trip.destination}
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">{trip.title}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-accent">₹{trip.price.toLocaleString()}</span>
                        <span className="text-xs text-muted">{trip.duration} days</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FiHeart size={32} />}
              title="No saved trips yet"
              description="Explore our curated trips and save your favorites for later."
              actionLabel="Explore Trips"
              actionHref="/trips"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
