'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin, FiStar, FiUsers, FiShield, FiCpu, FiCompass, FiShoppingBag } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  const featuredTrips = mockTrips.slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-teal/5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <FiCpu size={14} /> AI-Powered Travel Planning
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Explore the World with{' '}
              <span className="gradient-text">VOYNEX</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Your complete travel companion — discover breathtaking destinations, plan AI-powered itineraries,
              and book unforgettable experiences. All in one place.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trips"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Explore Trips <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ai-planner"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border text-foreground font-semibold text-lg hover:border-primary hover:text-primary transition-all">
                <FiCpu /> AI Trip Planner
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { value: '500+', label: 'Destinations' },
                { value: '50K+', label: 'Happy Travelers' },
                { value: '4.8', label: 'Avg Rating' },
                { value: '200+', label: 'Travel Agencies' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold gradient-text">{s.value}</div>
                  <div className="text-sm text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-teal uppercase tracking-wider">Top Picks</span>
              <h2 className="text-4xl font-bold mt-2">Featured Trips</h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">Handpicked experiences curated by our travel experts and loved by thousands of travelers.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrips.map((trip, idx) => (
                <motion.div key={trip._id} variants={fadeUp}>
                  <Link href={`/trips/${trip._id}`}
                    className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Image placeholder with gradient */}
                    <div className="relative h-56 overflow-hidden">
                      <img
  src={trip.images[0]}
  alt={trip.title}
  className="absolute inset-0 w-full h-full object-cover"
/>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                          {trip.duration} Days
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs">
                        <FiStar size={12} fill="currentColor" /> {trip.rating}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1 text-muted text-xs mb-2">
                        <FiMapPin size={12} /> {trip.destination}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{trip.title}</h3>
                      <p className="text-sm text-muted line-clamp-2 mb-4">{trip.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">₹{trip.price.toLocaleString()}</span>
                          <span className="text-xs text-muted"> /person</span>
                        </div>
                        <span className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary group-hover:text-white transition-all">
                          Book Now
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link href="/trips" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                View all trips <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-orange uppercase tracking-wider">Why VOYNEX</span>
              <h2 className="text-4xl font-bold mt-2">Everything You Need to Travel</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FiCpu, title: 'AI Trip Planner', desc: 'Generate personalized itineraries based on your budget, interests, and group composition.', color: 'from-blue-500 to-blue-600' },
                { icon: FiCompass, title: 'Smart Packing', desc: 'AI-powered packing checklists customized for your destination and activities.', color: 'from-teal-500 to-teal-600' },
                { icon: FiShoppingBag, title: 'Travel Shop', desc: 'Premium travel gear, jackets, and accessories delivered to your doorstep.', color: 'from-orange-500 to-orange-600' },
                { icon: FiShield, title: 'Secure Booking', desc: 'Safe payments, instant confirmations, and 24/7 support for peace of mind.', color: 'from-purple-500 to-purple-600' },
                { icon: FiUsers, title: 'Group Planning', desc: 'Plan for families with children, adults, and seniors with tailored recommendations.', color: 'from-pink-500 to-pink-600' },
                { icon: FiStar, title: 'Verified Reviews', desc: 'Real reviews from real travelers to help you choose the perfect trip.', color: 'from-yellow-500 to-yellow-600' },
                { icon: FiMapPin, title: 'Rental Services', desc: 'Rent bikes, cars, and GoPros at your destination for the ultimate experience.', color: 'from-green-500 to-green-600' },
                { icon: FiCpu, title: 'AI Chatbot', desc: 'Get instant answers to all your travel questions with our AI assistant.', color: 'from-indigo-500 to-indigo-600' },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-teal" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center text-white">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">Ready for Your Next Adventure?</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                Join 50,000+ travelers who trust VOYNEX for unforgettable journeys. Start planning your dream trip today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup"
                  className="px-8 py-4 rounded-xl bg-white text-primary font-semibold text-lg hover:bg-white/90 transition-all">
                  Get Started Free
                </Link>
                <Link href="/trips"
                  className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all">
                  Browse Trips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
