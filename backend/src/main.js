// ============================================================
// VOYNEX Backend - Main Server (NestJS-style Modular Architecture)
// ============================================================
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'voynex-secret-key-2026';

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── In-Memory Database (replace with MongoDB in production) ──
const db = {
  users: [
    { _id: 'u1', name: 'Admin User', email: 'admin@voynex.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', organization_id: 'org1', createdAt: new Date() },
    { _id: 'u2', name: 'Himalayan Trails', email: 'agency@himalayan.com', password: bcrypt.hashSync('agency123', 10), role: 'agency', organization_id: 'org1', createdAt: new Date() },
  ],
  trips: [],
  bookings: [],
  reviews: [],
  products: [],
  rentals: [],
  newsletters: [],
};

// ─── Auth Middleware ──────────────────────────────────────────
function authenticate(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    next();
  };
}

// ─── Auth Module ─────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  if (db.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { _id: uuidv4(), name, email, password: hashedPassword, role, organization_id: 'org1', createdAt: new Date() };
  db.users.push(user);
  const token = jwt.sign({ _id: user._id, email, role, name }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { _id: user._id, name, email, role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ _id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.users.find(u => u._id === req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

// ─── Users Module ────────────────────────────────────────────
app.get('/api/users', authenticate, authorize('admin'), (req, res) => {
  res.json(db.users.map(({ password, ...u }) => u));
});

app.delete('/api/users/:id', authenticate, authorize('admin'), (req, res) => {
  db.users = db.users.filter(u => u._id !== req.params.id);
  res.json({ message: 'User deleted' });
});

// ─── Trips Module ────────────────────────────────────────────
app.get('/api/trips', (req, res) => {
  const { destination, minPrice, maxPrice, minDuration, maxDuration, activityType } = req.query;
  let trips = [...db.trips];
  if (destination) trips = trips.filter(t => t.destination.toLowerCase().includes(destination.toLowerCase()));
  if (minPrice) trips = trips.filter(t => t.price >= +minPrice);
  if (maxPrice) trips = trips.filter(t => t.price <= +maxPrice);
  if (minDuration) trips = trips.filter(t => t.duration >= +minDuration);
  if (maxDuration) trips = trips.filter(t => t.duration <= +maxDuration);
  if (activityType) trips = trips.filter(t => t.activityType.includes(activityType));
  res.json(trips);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = db.trips.find(t => t._id === req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
});

app.post('/api/trips', authenticate, authorize('agency', 'admin'), (req, res) => {
  const trip = { _id: uuidv4(), ...req.body, agency: { _id: req.user._id, name: req.user.name }, organization_id: 'org1', rating: 0, reviewCount: 0, createdAt: new Date() };
  db.trips.push(trip);
  res.status(201).json(trip);
});

app.put('/api/trips/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  const idx = db.trips.findIndex(t => t._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Trip not found' });
  db.trips[idx] = { ...db.trips[idx], ...req.body };
  res.json(db.trips[idx]);
});

app.delete('/api/trips/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  db.trips = db.trips.filter(t => t._id !== req.params.id);
  res.json({ message: 'Trip deleted' });
});

// ─── Bookings Module ─────────────────────────────────────────
app.get('/api/bookings', authenticate, (req, res) => {
  let bookings = req.user.role === 'admin' ? db.bookings : db.bookings.filter(b => b.user === req.user._id);
  res.json(bookings);
});

app.post('/api/bookings', authenticate, (req, res) => {
  const booking = { _id: uuidv4(), ...req.body, user: req.user._id, status: 'pending', createdAt: new Date() };
  db.bookings.push(booking);
  res.status(201).json(booking);
});

app.put('/api/bookings/:id/status', authenticate, authorize('agency', 'admin'), (req, res) => {
  const booking = db.bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = req.body.status;
  res.json(booking);
});

// ─── Reviews Module ──────────────────────────────────────────
app.get('/api/reviews/:tripId', (req, res) => {
  res.json(db.reviews.filter(r => r.trip === req.params.tripId));
});

app.post('/api/reviews', authenticate, (req, res) => {
  const review = { _id: uuidv4(), ...req.body, user: { _id: req.user._id, name: req.user.name }, createdAt: new Date() };
  db.reviews.push(review);
  // Update trip average rating
  const tripReviews = db.reviews.filter(r => r.trip === review.trip);
  const trip = db.trips.find(t => t._id === review.trip);
  if (trip) {
    trip.rating = +(tripReviews.reduce((sum, r) => sum + r.rating, 0) / tripReviews.length).toFixed(1);
    trip.reviewCount = tripReviews.length;
  }
  res.status(201).json(review);
});

app.delete('/api/reviews/:id', authenticate, authorize('admin'), (req, res) => {
  db.reviews = db.reviews.filter(r => r._id !== req.params.id);
  res.json({ message: 'Review deleted' });
});

// ─── Newsletter Module ───────────────────────────────────────
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (db.newsletters.includes(email)) return res.status(400).json({ message: 'Already subscribed' });
  db.newsletters.push(email);
  res.json({ message: 'Subscribed successfully' });
});

// ─── Admin Stats Module ──────────────────────────────────────
app.get('/api/admin/stats', authenticate, authorize('admin'), (req, res) => {
  res.json({
    totalUsers: db.users.length,
    totalAgencies: db.users.filter(u => u.role === 'agency').length,
    totalTrips: db.trips.length,
    totalBookings: db.bookings.length,
    totalRevenue: db.bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  });
});

// ─── Agency Module ───────────────────────────────────────────

// Agency Trips (scoped to organization)
app.get('/api/agency/trips', authenticate, authorize('agency', 'admin'), (req, res) => {
  const orgTrips = db.trips.filter(t => t.organization_id === (req.user.organization_id || 'org1'));
  res.json(orgTrips);
});

app.post('/api/agency/trips', authenticate, authorize('agency', 'admin'), (req, res) => {
  const trip = { _id: uuidv4(), ...req.body, agency: { _id: req.user._id, name: req.user.name }, organization_id: req.user.organization_id || 'org1', active: true, rating: 0, reviewCount: 0, createdAt: new Date() };
  db.trips.push(trip);
  res.status(201).json(trip);
});

app.put('/api/agency/trips/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  const idx = db.trips.findIndex(t => t._id === req.params.id && t.organization_id === (req.user.organization_id || 'org1'));
  if (idx === -1) return res.status(404).json({ message: 'Trip not found' });
  db.trips[idx] = { ...db.trips[idx], ...req.body };
  res.json(db.trips[idx]);
});

app.put('/api/agency/trips/:id/toggle', authenticate, authorize('agency', 'admin'), (req, res) => {
  const trip = db.trips.find(t => t._id === req.params.id && t.organization_id === (req.user.organization_id || 'org1'));
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  trip.active = !trip.active;
  res.json(trip);
});

app.delete('/api/agency/trips/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  db.trips = db.trips.filter(t => !(t._id === req.params.id && t.organization_id === (req.user.organization_id || 'org1')));
  res.json({ message: 'Trip deleted' });
});

// Agency Bookings (scoped to organization)
app.get('/api/agency/bookings', authenticate, authorize('agency', 'admin'), (req, res) => {
  const orgId = req.user.organization_id || 'org1';
  const orgTripIds = db.trips.filter(t => t.organization_id === orgId).map(t => t._id);
  const bookings = db.bookings.filter(b => orgTripIds.includes(b.tripId || b.trip?._id));
  res.json(bookings);
});

app.put('/api/agency/bookings/:id/accept', authenticate, authorize('agency', 'admin'), (req, res) => {
  const booking = db.bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = 'confirmed';
  res.json(booking);
});

app.put('/api/agency/bookings/:id/reject', authenticate, authorize('agency', 'admin'), (req, res) => {
  const booking = db.bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = 'cancelled';
  res.json(booking);
});

app.put('/api/agency/bookings/:id/complete', authenticate, authorize('agency', 'admin'), (req, res) => {
  const booking = db.bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = 'completed';
  res.json(booking);
});

// Agency Analytics
app.get('/api/agency/analytics', authenticate, authorize('agency', 'admin'), (req, res) => {
  const orgId = req.user.organization_id || 'org1';
  const orgTrips = db.trips.filter(t => t.organization_id === orgId);
  const orgTripIds = orgTrips.map(t => t._id);
  const orgBookings = db.bookings.filter(b => orgTripIds.includes(b.tripId || b.trip?._id));

  res.json({
    totalTrips: orgTrips.length,
    activeTrips: orgTrips.filter(t => t.active !== false).length,
    inactiveTrips: orgTrips.filter(t => t.active === false).length,
    totalBookings: orgBookings.length,
    revenue: orgBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    averageRating: orgTrips.length ? +(orgTrips.reduce((sum, t) => sum + (t.rating || 0), 0) / orgTrips.length).toFixed(1) : 0,
  });
});

// Agency Rentals
app.get('/api/agency/rentals', authenticate, authorize('agency', 'admin'), (req, res) => {
  const orgRentals = db.rentals.filter(r => r.organization_id === (req.user.organization_id || 'org1'));
  res.json(orgRentals);
});

app.post('/api/agency/rentals', authenticate, authorize('agency', 'admin'), (req, res) => {
  const rental = { _id: uuidv4(), ...req.body, organization_id: req.user.organization_id || 'org1', available: true, createdAt: new Date() };
  db.rentals.push(rental);
  res.status(201).json(rental);
});

app.put('/api/agency/rentals/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  const idx = db.rentals.findIndex(r => r._id === req.params.id && r.organization_id === (req.user.organization_id || 'org1'));
  if (idx === -1) return res.status(404).json({ message: 'Rental not found' });
  db.rentals[idx] = { ...db.rentals[idx], ...req.body };
  res.json(db.rentals[idx]);
});

app.put('/api/agency/rentals/:id/toggle', authenticate, authorize('agency', 'admin'), (req, res) => {
  const rental = db.rentals.find(r => r._id === req.params.id && r.organization_id === (req.user.organization_id || 'org1'));
  if (!rental) return res.status(404).json({ message: 'Rental not found' });
  rental.available = !rental.available;
  res.json(rental);
});

app.delete('/api/agency/rentals/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  db.rentals = db.rentals.filter(r => !(r._id === req.params.id && r.organization_id === (req.user.organization_id || 'org1')));
  res.json({ message: 'Rental deleted' });
});

// Agency Team
app.get('/api/agency/team', authenticate, authorize('agency', 'admin'), (req, res) => {
  const orgMembers = db.users.filter(u => u.organization_id === (req.user.organization_id || 'org1') && u.role !== 'user');
  res.json(orgMembers.map(({ password, ...u }) => u));
});

app.post('/api/agency/team/invite', authenticate, authorize('agency', 'admin'), (req, res) => {
  const { name, email, role = 'staff' } = req.body;
  if (db.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already exists' });
  const member = { _id: uuidv4(), name, email, password: '', role, organization_id: req.user.organization_id || 'org1', status: 'invited', createdAt: new Date() };
  db.users.push(member);
  res.status(201).json({ _id: member._id, name, email, role, status: 'invited' });
});

app.put('/api/agency/team/:id/role', authenticate, authorize('agency', 'admin'), (req, res) => {
  const member = db.users.find(u => u._id === req.params.id && u.organization_id === (req.user.organization_id || 'org1'));
  if (!member) return res.status(404).json({ message: 'Member not found' });
  member.role = req.body.role;
  res.json({ _id: member._id, name: member.name, email: member.email, role: member.role });
});

app.delete('/api/agency/team/:id', authenticate, authorize('agency', 'admin'), (req, res) => {
  db.users = db.users.filter(u => !(u._id === req.params.id && u.organization_id === (req.user.organization_id || 'org1')));
  res.json({ message: 'Member removed' });
});

// ─── Admin Module (Super Admin Panel) ────────────────────────
const { setupAdminRoutes } = require('./admin');
setupAdminRoutes(app, db, authenticate, authorize);

// ─── Seed Demo Data for Admin Dashboard ──────────────────────
(function seedAdminData() {
  // Seed some trips if empty
  if (db.trips.length === 0) {
    const demoTrips = [
      { _id: 'dt1', title: 'Mystical Manali & Solang Valley', destination: 'Manali, Himachal Pradesh', price: 15999, duration: 5, images: [], activityType: ['adventure','nature'], highlights: ['Solang Valley'], itinerary: [], agency: { _id: 'u2', name: 'Himalayan Trails' }, organization_id: 'org1', rating: 4.7, reviewCount: 128, maxGroupSize: 20, difficulty: 'moderate', included: ['Hotel'], excluded: ['Flights'], startDates: ['2026-05-15'], active: true, moderationStatus: 'approved', createdAt: new Date('2025-10-01') },
      { _id: 'dt2', title: 'Goa Beach Paradise', destination: 'Goa', price: 12499, duration: 4, images: [], activityType: ['beach','nightlife'], highlights: ['Baga Beach'], itinerary: [], agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org2', rating: 4.5, reviewCount: 256, maxGroupSize: 25, difficulty: 'easy', included: ['Resort'], excluded: ['Flights'], startDates: ['2026-05-01'], active: true, moderationStatus: 'approved', createdAt: new Date('2025-09-15') },
      { _id: 'dt3', title: 'Royal Rajasthan Circuit', destination: 'Rajasthan', price: 24999, duration: 7, images: [], activityType: ['culture','heritage'], highlights: ['Amber Fort'], itinerary: [], agency: { _id: 'u2', name: 'Himalayan Trails' }, organization_id: 'org1', rating: 4.8, reviewCount: 89, maxGroupSize: 15, difficulty: 'easy', included: ['Hotels'], excluded: ['Flights'], startDates: ['2026-10-01'], active: true, moderationStatus: 'approved', createdAt: new Date('2025-11-01') },
      { _id: 'dt4', title: 'Kerala Backwaters Bliss', destination: 'Kerala', price: 18999, duration: 6, images: [], activityType: ['nature','wellness'], highlights: ['Houseboat'], itinerary: [], agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org2', rating: 4.9, reviewCount: 67, maxGroupSize: 12, difficulty: 'easy', included: ['Stays'], excluded: ['Flights'], startDates: ['2026-08-01'], active: true, moderationStatus: 'approved', createdAt: new Date('2025-12-01') },
      { _id: 'dt5', title: 'Ladakh Adventure Expedition', destination: 'Ladakh', price: 29999, duration: 8, images: [], activityType: ['adventure','photography'], highlights: ['Pangong Lake'], itinerary: [], agency: { _id: 'u2', name: 'Himalayan Trails' }, organization_id: 'org1', rating: 4.6, reviewCount: 43, maxGroupSize: 10, difficulty: 'challenging', included: ['Camps'], excluded: ['Flights'], startDates: ['2026-06-15'], active: true, moderationStatus: 'pending', createdAt: new Date('2025-11-15') },
      { _id: 'dt6', title: 'Andaman Tropical Escape', destination: 'Andaman Islands', price: 22499, duration: 5, images: [], activityType: ['beach','water-sports'], highlights: ['Scuba Diving'], itinerary: [], agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org2', rating: 4.7, reviewCount: 95, maxGroupSize: 18, difficulty: 'easy', included: ['Ferry'], excluded: ['Flights'], startDates: ['2026-10-01'], active: true, moderationStatus: 'approved', createdAt: new Date('2026-01-01') },
    ];
    db.trips.push(...demoTrips);
  }

  // Seed users
  if (db.users.length <= 2) {
    db.users.push(
      { _id: 'u3', name: 'Priya Patel', email: 'priya@gmail.com', password: '', role: 'user', organization_id: '', createdAt: new Date('2025-03-20') },
      { _id: 'u4', name: 'Rahul Verma', email: 'rahul@outlook.com', password: '', role: 'user', organization_id: '', createdAt: new Date('2025-04-10') },
      { _id: 'u5', name: 'Ananya Singh', email: 'ananya@gmail.com', password: '', role: 'user', organization_id: '', createdAt: new Date('2025-05-15') },
      { _id: 'u6', name: 'Vikram Joshi', email: 'vikram@yahoo.com', password: '', role: 'user', organization_id: '', createdAt: new Date('2025-06-20') },
      { _id: 'u7', name: 'Meera Nair', email: 'meera@gmail.com', password: '', role: 'user', organization_id: '', createdAt: new Date('2025-07-10') },
      { _id: 'a2', name: 'Coastal Escapes', email: 'info@coastal.com', password: '', role: 'agency', organization_id: 'org2', subscriptionPlan: 'pro', approvalStatus: 'approved', createdAt: new Date('2025-02-10') },
      { _id: 'a3', name: 'Mountain Explorers', email: 'hello@mountain.com', password: '', role: 'agency', organization_id: 'org3', subscriptionPlan: 'free', approvalStatus: 'pending', createdAt: new Date('2026-04-18') },
    );
  }

  // Seed bookings
  if (db.bookings.length === 0) {
    db.bookings.push(
      { _id: 'bk1', trip: db.trips[0], tripId: 'dt1', user: 'u3', userName: 'Priya Patel', userEmail: 'priya@gmail.com', startDate: '2026-05-15', guests: 3, totalPrice: 47997, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-04-01' },
      { _id: 'bk2', trip: db.trips[1], tripId: 'dt2', user: 'u4', userName: 'Rahul Verma', userEmail: 'rahul@outlook.com', startDate: '2026-05-01', guests: 2, totalPrice: 24998, status: 'pending', paymentStatus: 'pending', createdAt: '2026-04-10' },
      { _id: 'bk3', trip: db.trips[2], tripId: 'dt3', user: 'u5', userName: 'Ananya Singh', userEmail: 'ananya@gmail.com', startDate: '2026-10-01', guests: 4, totalPrice: 99996, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-04-05' },
      { _id: 'bk4', trip: db.trips[3], tripId: 'dt4', user: 'u6', userName: 'Vikram Joshi', userEmail: 'vikram@yahoo.com', startDate: '2026-08-01', guests: 4, totalPrice: 75996, status: 'completed', paymentStatus: 'paid', createdAt: '2025-07-01' },
      { _id: 'bk5', trip: db.trips[4], tripId: 'dt5', user: 'u7', userName: 'Meera Nair', userEmail: 'meera@gmail.com', startDate: '2026-06-15', guests: 2, totalPrice: 59998, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-03-28' },
      { _id: 'bk6', trip: db.trips[0], tripId: 'dt1', user: 'u4', userName: 'Rahul Verma', userEmail: 'rahul@outlook.com', startDate: '2026-06-01', guests: 5, totalPrice: 79995, status: 'pending', paymentStatus: 'pending', createdAt: '2026-04-15' },
      { _id: 'bk7', trip: db.trips[5], tripId: 'dt6', user: 'u5', userName: 'Ananya Singh', userEmail: 'ananya@gmail.com', startDate: '2026-10-01', guests: 2, totalPrice: 44998, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2026-03-10' },
      { _id: 'bk8', trip: db.trips[2], tripId: 'dt3', user: 'u7', userName: 'Meera Nair', userEmail: 'meera@gmail.com', startDate: '2026-11-15', guests: 6, totalPrice: 149994, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-04-18' },
    );
  }

  // Seed reviews
  if (db.reviews.length === 0) {
    db.reviews.push(
      { _id: 'rv1', trip: 'dt1', user: { _id: 'u3', name: 'Priya Patel' }, rating: 5, comment: 'Absolutely magical experience! The Solang Valley was breathtaking.', createdAt: '2026-03-15' },
      { _id: 'rv2', trip: 'dt1', user: { _id: 'u4', name: 'Rahul Verma' }, rating: 4, comment: 'Great trip, well organized. Could improve the hotel quality.', createdAt: '2026-03-10' },
      { _id: 'rv3', trip: 'dt2', user: { _id: 'u5', name: 'Ananya Singh' }, rating: 5, comment: 'Best Goa trip ever! Water sports were incredible.', createdAt: '2026-02-20' },
      { _id: 'rv4', trip: 'dt3', user: { _id: 'u6', name: 'Vikram Joshi' }, rating: 5, comment: 'Rajasthan is truly the land of kings. Unforgettable!', createdAt: '2026-01-25' },
      { _id: 'rv5', trip: 'dt4', user: { _id: 'u7', name: 'Meera Nair' }, rating: 5, comment: 'Houseboat in Alleppey was beyond words. Pure bliss!', createdAt: '2026-02-05' },
      { _id: 'rv6', trip: 'dt1', user: { _id: 'u6', name: 'Vikram Joshi' }, rating: 3, comment: 'Good trip but weather was not cooperative.', createdAt: '2026-01-18' },
      { _id: 'rv7', trip: 'dt5', user: { _id: 'u7', name: 'Meera Nair' }, rating: 5, comment: 'Life-changing! Pangong Lake was surreal.', createdAt: '2026-02-28' },
      { _id: 'rv8', trip: 'dt6', user: { _id: 'u3', name: 'Priya Patel' }, rating: 4, comment: 'Pristine beaches. Scuba diving was amazing!', createdAt: '2026-04-01' },
    );
  }

  // Seed rentals
  if (db.rentals.length === 0) {
    db.rentals.push(
      { _id: 'rl1', name: 'Royal Enfield Himalayan', type: 'bike', pricePerDay: 1500, location: 'Manali', available: true, organization_id: 'org1', createdAt: new Date() },
      { _id: 'rl2', name: 'Honda Activa 6G', type: 'scooty', pricePerDay: 500, location: 'Goa', available: true, organization_id: 'org2', createdAt: new Date() },
      { _id: 'rl3', name: 'Maruti Swift Dzire', type: 'car', pricePerDay: 2500, location: 'Rajasthan', available: true, organization_id: 'org1', createdAt: new Date() },
      { _id: 'rl4', name: 'GoPro Hero 12', type: 'gopro', pricePerDay: 800, location: 'All Locations', available: true, organization_id: 'org1', createdAt: new Date() },
      { _id: 'rl5', name: 'KTM Duke 390', type: 'bike', pricePerDay: 2000, location: 'Ladakh', available: true, organization_id: 'org1', createdAt: new Date() },
      { _id: 'rl6', name: 'Toyota Innova Crysta', type: 'car', pricePerDay: 4500, location: 'Kerala', available: false, organization_id: 'org2', createdAt: new Date() },
    );
  }
})();

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'voynex-api', timestamp: new Date() }));

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 VOYNEX API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
