'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { FiSun, FiMoon, FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/trips', label: 'Explore Trips' },
    { href: '/shop', label: 'Shop' },
    { href: '/rentals', label: 'Rentals' },
    { href: '/ai-planner', label: 'AI Planner' },
    { href: '/packing-assistant', label: 'Packing' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal font-bold text-white text-lg">
              V
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">VOYNEX</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-all">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-all">
              <FiShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover transition-all">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-foreground">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} className="text-muted" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase">
                          {user?.role}
                        </span>
                      </div>
                      {user?.role === 'user' && (
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover transition-all">
                          <FiUser size={14} /> Dashboard
                        </Link>
                      )}
                      {user?.role === 'agency' && (
                        <Link href="/agency" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover transition-all">
                          <FiUser size={14} /> Agency Portal
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover transition-all">
                          <FiUser size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-surface-hover transition-all">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                  Log in
                </Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-teal text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-all">
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-border py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-surface-hover transition-all">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
