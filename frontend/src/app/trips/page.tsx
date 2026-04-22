'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiX } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';

const ACTIVITY_TYPES = ['adventure', 'nature', 'beach', 'culture', 'heritage', 'photography', 'wellness', 'nightlife', 'water-sports'];
const GRADIENTS = [
  'from-blue-400 to-purple-600', 'from-orange-400 to-pink-500', 'from-teal-400 to-emerald-600',
  'from-rose-400 to-red-500', 'from-indigo-400 to-blue-600', 'from-amber-400 to-orange-600',
];

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 15]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrips = useMemo(() => {
    return mockTrips.filter(trip => {
      const matchSearch = !search || trip.title.toLowerCase().includes(search.toLowerCase()) || trip.destination.toLowerCase().includes(search.toLowerCase());
      const matchPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1];
      const matchDuration = trip.duration >= durationRange[0] && trip.duration <= durationRange[1];
      const matchActivity = selectedActivities.length === 0 || trip.activityType.some(a => selectedActivities.includes(a));
      return matchSearch && matchPrice && matchDuration && matchActivity;
    });
  }, [search, priceRange, durationRange, selectedActivities]);

  const toggleActivity = (a: string) => setSelectedActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Explore Trips</h1>
          <p className="text-muted mt-2">Discover {mockTrips.length} handpicked travel experiences</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations, trips..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-sm font-medium hover:bg-surface-hover transition-all">
            <FiFilter size={16} /> Filters
            {(selectedActivities.length > 0 || priceRange[1] < 50000 || durationRange[1] < 15) && (
              <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">!</span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => { setSelectedActivities([]); setPriceRange([0, 50000]); setDurationRange([0, 15]); }}
                className="text-sm text-primary hover:underline">Clear all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}</label>
                <input type="range" min={0} max={50000} step={1000} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration: {durationRange[0]}–{durationRange[1]} days</label>
                <input type="range" min={0} max={15} step={1} value={durationRange[1]} onChange={e => setDurationRange([durationRange[0], +e.target.value])}
                  className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Activity Type</label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TYPES.map(a => (
                    <button key={a} onClick={() => toggleActivity(a)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                        selectedActivities.includes(a) ? 'bg-primary text-white' : 'bg-surface-hover text-muted hover:text-foreground'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active filters */}
        {selectedActivities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedActivities.map(a => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                {a} <FiX size={12} className="cursor-pointer" onClick={() => toggleActivity(a)} />
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted mb-6">{filteredTrips.length} trips found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip, idx) => (
            <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link href={`/trips/${trip._id}`}
                className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">{trip.duration} Days</span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium capitalize">{trip.difficulty}</span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                    <FiStar size={12} fill="currentColor" /> {trip.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-muted text-xs mb-2"><FiMapPin size={12} /> {trip.destination}</div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{trip.title}</h3>
                  <p className="text-sm text-muted line-clamp-2 mb-4">{trip.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trip.activityType.slice(0, 3).map(a => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-surface-hover text-xs text-muted capitalize">{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{trip.price.toLocaleString()}</span>
                      <span className="text-xs text-muted"> /person</span>
                    </div>
                    <span className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary group-hover:text-white transition-all">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold">No trips found</p>
            <p className="text-muted mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
