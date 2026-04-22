'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiMapPin, FiPhone, FiArrowRight } from 'react-icons/fi';
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal font-bold text-white text-lg">V</div>
              <span className="text-xl font-bold gradient-text">VOYNEX</span>
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed">Your complete travel companion. Discover, plan, and book unforgettable journeys with AI-powered tools.</p>
            <div className="flex gap-3">
              {[FaTwitter, FaInstagram, FaFacebook, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-surface-hover text-muted hover:text-primary hover:bg-primary/10 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[{ href: '/trips', label: 'Explore Trips' }, { href: '/shop', label: 'Travel Shop' }, { href: '/rentals', label: 'Rentals' },
                { href: '/ai-planner', label: 'AI Trip Planner' }, { href: '/packing-assistant', label: 'Packing Assistant' }].map(link => (
                <Link key={link.href} href={link.href} className="text-sm text-muted hover:text-primary transition-all">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-muted">
              <div className="flex items-center gap-2"><FiMapPin size={14} className="text-primary" /> Mumbai, India</div>
              <div className="flex items-center gap-2"><FiPhone size={14} className="text-teal" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><FiMail size={14} className="text-orange" /> hello@voynex.com</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted mb-4">Get travel inspiration and exclusive deals straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="submit"
                className="px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all">
                <FiArrowRight size={16} />
              </button>
            </form>
            {subscribed && <p className="text-xs text-teal mt-2">✓ Subscribed successfully!</p>}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© 2026 VOYNEX. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
