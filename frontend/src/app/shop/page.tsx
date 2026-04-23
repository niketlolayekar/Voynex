'use client';
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiSearch } from 'react-icons/fi';
import { mockProducts } from '@/lib/mockData';
import { useCart } from '@/contexts/CartContext';

const CATEGORIES = ['all', 'jackets', 'bags', 'accessories', 'gear', 'electronics'];

export default function ShopPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = useMemo(() => mockProducts.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [category, search]);

  const handleAdd = (product: typeof mockProducts[0]) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Travel Shop</h1>
          <p className="text-muted mt-2">Premium gear for your next adventure</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                  category === c ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-surface-hover'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              {/* <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">🎒</div> */}
                <div className="h-48 relative overflow-hidden">
  <img
    src={product.images[0]}
    alt={product.name}
    className="w-full h-full object-cover"
  />
                {product.stock < 20 && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-orange text-white text-[10px] font-bold">Low Stock</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted capitalize mb-1">{product.category}</p>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  <FiStar size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-muted">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  <button onClick={() => handleAdd(product)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      addedId === product._id ? 'bg-teal text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}>
                    <FiShoppingCart size={14} /> {addedId === product._id ? 'Added!' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
