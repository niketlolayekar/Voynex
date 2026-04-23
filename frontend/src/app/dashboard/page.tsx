'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiArrowRight, FiHeart, FiSettings } from 'react-icons/fi';
import { mockBookings, mockTrips } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const statusColors: Record<string, string> = {
  confirmed: 'bg-teal/10 text-teal', pending: 'bg-yellow-500/10 text-yellow-600',
  cancelled: 'bg-red-500/10 text-red-500', completed: 'bg-primary/10 text-primary',
};

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8">
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
              { label: 'Upcoming Trips', value: mockBookings.filter(b => b.status === 'confirmed').length, icon: FiMapPin, color: 'text-teal bg-teal/10' },
              { label: 'Saved Trips', value: 4, icon: FiHeart, color: 'text-orange bg-orange/10' },
              { label: 'Reviews Given', value: 2, icon: FiStar, color: 'text-yellow-500 bg-yellow-500/10' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border bg-card">
                <div className={`inline-flex p-2.5 rounded-xl ${s.color} mb-3`}><s.icon size={18} /></div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Bookings */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Bookings</h2>
              <Link href="/trips" className="text-sm text-primary hover:underline flex items-center gap-1">Browse trips <FiArrowRight size={14} /></Link>
            </div>
            <div className="space-y-4">
              {mockBookings.map(booking => (
                <div key={booking._id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary to-teal flex-shrink-0" /> */}
                    <img
  src={booking.trip.images[0]}
  alt={booking.trip.title}
  className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
/>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{booking.trip.title}</h3>
                          <p className="text-sm text-muted flex items-center gap-1 mt-1"><FiMapPin size={12} /> {booking.trip.destination}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[booking.status]}`}>{booking.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted">
                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><FiUsers size={12} /> {booking.guests} guests</span>
                        <span className="font-medium text-foreground">₹{booking.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Saved Trips */}
          <motion.div variants={fadeUp} className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Saved Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrips.slice(2, 5).map(trip => (
                <Link key={trip._id} href={`/trips/${trip._id}`}
                  className="group p-4 rounded-2xl border border-border bg-card hover:shadow-md transition-all">
                  {/* <div className="h-32 rounded-xl bg-gradient-to-br from-teal to-emerald-600 mb-3" /> */}
                  <img
  src={trip.images[0]}
  alt={trip.title}
  className="h-32 w-full rounded-xl object-cover mb-3"
/>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{trip.title}</h3>
                  <p className="text-sm text-muted mt-1">{trip.destination} · {trip.duration} days</p>
                  <p className="text-primary font-semibold mt-2">₹{trip.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div variants={fadeUp} className="mt-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                <button className="text-sm text-primary flex items-center gap-1"><FiSettings size={14} /> Edit</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted mb-1">Travel Style</p>
                  <p className="font-medium capitalize">{user?.preferences?.travelStyle || 'Mid-range'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Favorite Destinations</p>
                  <div className="flex flex-wrap gap-1">
                    {(user?.preferences?.favoriteDestinations || ['Manali', 'Goa']).map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {(user?.preferences?.interests || ['trekking', 'photography']).map(i => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs capitalize">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
