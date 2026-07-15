'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiArrowRight, FiHeart, FiSettings } from 'react-icons/fi';
import { mockBookings, mockTrips } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Breadcrumbs from '@/components/Breadcrumbs';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const statusColors: Record<string, string> = {
  confirmed: 'bg-accent/10 text-accent', pending: 'bg-yellow-500/10 text-yellow-600',
  cancelled: 'bg-red-500/10 text-red-500', completed: 'bg-primary/10 text-primary',
};

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome */}
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="mb-8">
              <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-muted mt-1">Here&apos;s your travel overview</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', value: mockBookings.length, icon: FiCalendar, color: 'text-primary bg-primary/10' },
                { label: 'Upcoming Trips', value: mockBookings.filter(b => b.status === 'confirmed').length, icon: FiMapPin, color: 'text-accent bg-accent/10' },
                { label: 'Saved Trips', value: 4, icon: FiHeart, color: 'text-orange bg-orange/10' },
                { label: 'Reviews Given', value: 2, icon: FiStar, color: 'text-yellow-500 bg-yellow-500/10' },
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-card hover-glow transition-all">
                  <div className={`inline-flex p-3 rounded-xl ${s.color} mb-4`}><s.icon size={20} /></div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Bookings */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Bookings</h2>
                <Link href="/trips" className="text-sm font-medium text-accent hover:underline flex items-center gap-1 tap-target">Browse trips <FiArrowRight size={14} /></Link>
              </div>
              <div className="space-y-4">
                {mockBookings.map(booking => (
                  <div key={booking._id} className="rounded-2xl border border-border bg-card p-5 hover-glow transition-all">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary to-teal flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.trip.title}</h3>
                            <p className="text-sm text-muted flex items-center gap-1 mt-1"><FiMapPin size={12} /> {booking.trip.destination}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[booking.status]}`}>{booking.status}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted">
                          <span className="flex items-center gap-1"><FiCalendar size={14} /> {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><FiUsers size={14} /> {booking.guests} guests</span>
                          <span className="font-bold text-accent">₹{booking.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Saved Trips */}
            <motion.div variants={fadeUp} className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Saved Trips</h2>
                <Link href="/my-trips/saved" className="text-sm font-medium text-accent hover:underline flex items-center gap-1 tap-target">View all <FiArrowRight size={14} /></Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTrips.slice(2, 5).map((trip, idx) => (
                  <Link key={trip._id} href={`/trips/${trip._id}`}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover-glow transition-all">
                    <div className={`h-40 bg-gradient-to-br ${
                      ['from-accent to-emerald-600', 'from-blue-400 to-purple-600', 'from-orange-400 to-pink-500'][idx % 3]
                    } relative img-dark-overlay`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg group-hover:text-accent transition-colors truncate">{trip.title}</h3>
                      <p className="text-sm text-muted mt-1">{trip.destination} · {trip.duration} days</p>
                      <p className="text-accent font-bold mt-3">₹{trip.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={fadeUp} className="mt-10">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <button className="text-sm font-medium text-accent flex items-center gap-1 hover:underline tap-target"><FiSettings size={14} /> Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted mb-2 font-medium">Travel Style</p>
                    <p className="font-semibold capitalize">{user?.preferences?.travelStyle || 'Mid-range'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-2 font-medium">Favorite Destinations</p>
                    <div className="flex flex-wrap gap-2">
                      {(user?.preferences?.favoriteDestinations || ['Manali', 'Goa']).map(d => (
                        <span key={d} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-2 font-medium">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {(user?.preferences?.interests || ['trekking', 'photography']).map(i => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">{i}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
