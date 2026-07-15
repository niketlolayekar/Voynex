'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';
import Breadcrumbs from '@/components/Breadcrumbs';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const DEST_GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-orange-400 to-pink-500',
  'from-teal-400 to-emerald-600',
  'from-rose-400 to-red-500',
  'from-indigo-400 to-blue-600',
  'from-amber-400 to-orange-600',
];

export default function DestinationsPage() {
  const destinations = useMemo(() => {
    const destMap = new Map<string, { trips: typeof mockTrips; totalReviews: number }>();
    mockTrips.forEach(trip => {
      const dest = trip.destination;
      if (!destMap.has(dest)) destMap.set(dest, { trips: [], totalReviews: 0 });
      const entry = destMap.get(dest)!;
      entry.trips.push(trip);
      entry.totalReviews += trip.reviewCount;
    });

    return Array.from(destMap.entries()).map(([name, data]) => ({
      name,
      tripCount: data.trips.length,
      avgRating: +(data.trips.reduce((sum, t) => sum + t.rating, 0) / data.trips.length).toFixed(1),
      priceRange: {
        min: Math.min(...data.trips.map(t => t.price)),
        max: Math.max(...data.trips.map(t => t.price)),
      },
      totalReviews: data.totalReviews,
      activities: [...new Set(data.trips.flatMap(t => t.activityType))],
    }));
  }, []);

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Destinations</h1>
            <p className="text-muted">Explore {destinations.length} incredible destinations across India</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, idx) => (
              <motion.div key={dest.name} variants={fadeUp}>
                <Link
                  href={`/trips?destination=${encodeURIComponent(dest.name)}`}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden hover-glow transition-all duration-300"
                >
                  <div className={`relative h-44 bg-gradient-to-br ${DEST_GRADIENTS[idx % DEST_GRADIENTS.length]} flex items-end p-5`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><FiStar size={12} fill="currentColor" /> {dest.avgRating}</span>
                        <span>{dest.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted">{dest.tripCount} trip{dest.tripCount > 1 ? 's' : ''} available</span>
                      <span className="text-sm font-medium text-accent">
                        ₹{dest.priceRange.min.toLocaleString()} – ₹{dest.priceRange.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dest.activities.slice(0, 4).map(a => (
                        <span key={a} className="pill pill-accent capitalize">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                      Explore trips <FiArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
