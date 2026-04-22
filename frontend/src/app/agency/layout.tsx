'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiMap, FiCalendar, FiTruck, FiBarChart2, FiUsers, FiStar, FiCreditCard, FiMenu, FiX, FiChevronRight, FiLogOut } from 'react-icons/fi';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/agency', label: 'Dashboard', icon: FiGrid },
  { href: '/agency/trips', label: 'Trips', icon: FiMap },
  { href: '/agency/bookings', label: 'Bookings', icon: FiCalendar },
  { href: '/agency/rentals', label: 'Rentals', icon: FiTruck },
  { href: '/agency/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/agency/team', label: 'Team', icon: FiUsers },
  { href: '/agency/reviews', label: 'Reviews', icon: FiStar },
  { href: '/agency/subscription', label: 'Subscription', icon: FiCreditCard },
];

function AgencyLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface flex-shrink-0">
        <div className="px-5 py-6 border-b border-border">
          <h2 className="text-lg font-bold gradient-text">Agency Portal</h2>
          <p className="text-xs text-muted mt-0.5">Himalayan Trails</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/agency' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-surface-hover hover:text-foreground'
                }`}>
                <item.icon size={18} className={isActive ? 'text-primary' : 'text-muted group-hover:text-foreground'} />
                {item.label}
                {isActive && <FiChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border space-y-2">
          <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-teal/10">
            <p className="text-xs font-medium">Pro Plan</p>
            <p className="text-[10px] text-muted mt-0.5">15 trips · 5 team members</p>
            <Link href="/agency/subscription" className="text-[10px] text-primary font-medium hover:underline mt-1 inline-block">
              Upgrade →
            </Link>
          </div>
          <div className="flex items-center justify-between px-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-[10px] text-white font-bold">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{user?.name || 'Agency'}</p>
                <p className="text-[10px] text-muted truncate">{user?.email || 'agency@voynex.com'}</p>
              </div>
            </div>
            <button onClick={() => logout()} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0" title="Logout">
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-border z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold gradient-text">Agency Portal</h2>
                  <p className="text-xs text-muted">Himalayan Trails</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-surface-hover"><FiX size={18} /></button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                  const isActive = pathname === item.href || (item.href !== '/agency' && pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface-hover hover:text-foreground'
                      }`}>
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Mobile header bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-surface-hover">
            <FiMenu size={18} />
          </button>
          <span className="text-sm font-semibold gradient-text">Agency Portal</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['agency', 'admin']}>
      <AgencyLayoutInner>{children}</AgencyLayoutInner>
    </ProtectedRoute>
  );
}
