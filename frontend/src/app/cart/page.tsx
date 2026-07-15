'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Breadcrumbs />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="h-24 w-24 rounded-full bg-surface-hover flex items-center justify-center text-muted mb-6">
            <FiShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted mb-8 text-center max-w-sm">Looks like you haven&apos;t added any travel gear yet. Explore our shop for premium items.</p>
          <Link href="/shop" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-medium hover:shadow-lg transition-all tap-target">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart <span className="text-muted text-xl font-normal">({totalItems} items)</span></h1>
            <button onClick={clearCart} className="text-sm font-medium text-red-400 hover:text-red-500 hover:underline tap-target">Clear Cart</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <motion.div key={item.product._id} layout className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-border bg-card hover-glow transition-all">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700/50 dark:to-gray-800/50 flex-shrink-0 flex items-center justify-center text-3xl img-dark-overlay">🎒</div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-muted capitalize mb-1">{item.product.category}</p>
                        <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                      </div>
                      <button onClick={() => removeFromCart(item.product._id)} className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors tap-target">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all tap-target">
                          <FiMinus size={14} />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all tap-target">
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-accent text-lg">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                        {item.quantity > 1 && <div className="text-xs text-muted">₹{item.product.price.toLocaleString()} each</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm border-b border-border pb-6 mb-6">
                  <div className="flex justify-between"><span className="text-muted">Subtotal ({totalItems} items)</span><span className="font-medium">₹{totalPrice.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="text-accent font-medium">Free</span></div>
                  <div className="flex justify-between"><span className="text-muted">Estimated Tax (5%)</span><span className="font-medium">₹{Math.round(totalPrice * 0.05).toLocaleString()}</span></div>
                </div>
                <div className="flex justify-between font-bold text-xl mb-8">
                  <span>Total</span><span className="text-accent">₹{Math.round(totalPrice * 1.05).toLocaleString()}</span>
                </div>
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all tap-target">
                  Checkout <FiArrowRight />
                </button>
                <div className="mt-4 text-center">
                  <Link href="/shop" className="text-sm font-medium text-accent hover:underline tap-target">Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
