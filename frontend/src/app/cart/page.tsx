'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiShoppingBag size={48} className="text-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted mb-6">Explore our travel shop for premium gear</p>
        <Link href="/shop" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart ({totalItems})</h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <motion.div key={item.product._id} layout className="flex gap-4 p-4 rounded-2xl border border-border bg-card">
                <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 flex items-center justify-center text-2xl">🎒</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted capitalize">{item.product.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product._id)} className="text-muted hover:text-red-500 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-hover transition-all">
                        <FiMinus size={14} />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-hover transition-all">
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="text-teal">Free</span></div>
                <div className="flex justify-between"><span className="text-muted">Tax (5%)</span><span>₹{Math.round(totalPrice * 0.05).toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span><span className="text-primary">₹{Math.round(totalPrice * 1.05).toLocaleString()}</span>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
