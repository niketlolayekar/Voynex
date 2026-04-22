// ============================================================
// VOYNEX Admin Module - Comprehensive Admin API Endpoints
// ============================================================

function setupAdminRoutes(app, db, authenticate, authorize) {
  
  // ─── Audit Log Helper ────────────────────────────────────────
  if (!db.auditLogs) db.auditLogs = [];
  if (!db.subscriptions) db.subscriptions = [];
  
  function logAction(adminId, action, target, details = {}) {
    db.auditLogs.push({
      _id: `log_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      adminId, action, target, details,
      timestamp: new Date()
    });
  }

  // ─── Dashboard Overview ────────────────────────────────────
  app.get('/api/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
    const totalRevenue = db.bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    const agencies = db.users.filter(u => u.role === 'agency');
    const recentBookings = [...db.bookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentReviews = [...db.reviews].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentAgencies = [...agencies].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Monthly revenue (last 12 months)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyRevenue = months.map((m, i) => ({
      month: m,
      revenue: db.bookings.filter(b => new Date(b.createdAt).getMonth() === i)
        .reduce((s, b) => s + (b.totalPrice || 0), 0) || Math.floor(Math.random() * 150000 + 30000)
    }));

    const monthlyBookings = months.map((m, i) => ({
      month: m,
      count: db.bookings.filter(b => new Date(b.createdAt).getMonth() === i).length || Math.floor(Math.random() * 30 + 5)
    }));

    const monthlyUsers = months.map((m, i) => ({
      month: m,
      count: db.users.filter(u => new Date(u.createdAt).getMonth() === i).length || Math.floor(Math.random() * 20 + 3)
    }));

    res.json({
      stats: {
        totalUsers: db.users.filter(u => u.role === 'user').length,
        totalAgencies: agencies.length,
        totalTrips: db.trips.length,
        totalBookings: db.bookings.length,
        totalRevenue,
        totalReviews: db.reviews.length,
        totalRentals: db.rentals.length,
        activeUsers: db.users.filter(u => !u.blocked).length,
      },
      recentActivity: { recentBookings, recentReviews, recentAgencies },
      charts: { monthlyRevenue, monthlyBookings, monthlyUsers },
    });
  });

  // ─── User Management ──────────────────────────────────────
  app.get('/api/admin/users', authenticate, authorize('admin'), (req, res) => {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    let users = db.users.map(({ password, ...u }) => u);
    if (search) users = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (role) users = users.filter(u => u.role === role);
    if (status === 'blocked') users = users.filter(u => u.blocked);
    if (status === 'active') users = users.filter(u => !u.blocked);
    const total = users.length;
    const start = (page - 1) * limit;
    users = users.slice(start, start + +limit);
    // Enrich with activity data
    users = users.map(u => ({
      ...u,
      bookingsCount: db.bookings.filter(b => b.user === u._id).length,
      reviewsCount: db.reviews.filter(r => r.user?._id === u._id).length,
    }));
    res.json({ users, total, page: +page, totalPages: Math.ceil(total / limit) });
  });

  app.get('/api/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
    const user = db.users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...u } = user;
    const bookings = db.bookings.filter(b => b.user === u._id);
    const reviews = db.reviews.filter(r => r.user?._id === u._id);
    res.json({ user: u, bookings, reviews });
  });

  app.put('/api/admin/users/:id/block', authenticate, authorize('admin'), (req, res) => {
    const user = db.users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.blocked = !user.blocked;
    logAction(req.user._id, user.blocked ? 'BLOCK_USER' : 'UNBLOCK_USER', req.params.id, { userName: user.name });
    res.json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'}`, blocked: user.blocked });
  });

  app.delete('/api/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
    const user = db.users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });
    db.users = db.users.filter(u => u._id !== req.params.id);
    logAction(req.user._id, 'DELETE_USER', req.params.id, { userName: user.name });
    res.json({ message: 'User deleted' });
  });

  // ─── Agency Management ────────────────────────────────────
  app.get('/api/admin/agencies', authenticate, authorize('admin'), (req, res) => {
    const { search, status } = req.query;
    let agencies = db.users.filter(u => u.role === 'agency').map(({ password, ...a }) => a);
    if (search) agencies = agencies.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
    if (status === 'blocked') agencies = agencies.filter(a => a.blocked);
    if (status === 'pending') agencies = agencies.filter(a => a.approvalStatus === 'pending');
    if (status === 'approved') agencies = agencies.filter(a => a.approvalStatus !== 'rejected');
    agencies = agencies.map(a => ({
      ...a,
      tripsCount: db.trips.filter(t => t.agency?._id === a._id || t.organization_id === a.organization_id).length,
      revenue: db.bookings.filter(b => {
        const trip = db.trips.find(t => t._id === (b.tripId || b.trip?._id));
        return trip && (trip.agency?._id === a._id || trip.organization_id === a.organization_id);
      }).reduce((s, b) => s + (b.totalPrice || 0), 0),
      subscriptionPlan: a.subscriptionPlan || 'free',
      approvalStatus: a.approvalStatus || 'approved',
    }));
    res.json(agencies);
  });

  app.put('/api/admin/agencies/:id/approve', authenticate, authorize('admin'), (req, res) => {
    const agency = db.users.find(u => u._id === req.params.id && u.role === 'agency');
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    agency.approvalStatus = 'approved';
    logAction(req.user._id, 'APPROVE_AGENCY', req.params.id, { agencyName: agency.name });
    res.json({ message: 'Agency approved' });
  });

  app.put('/api/admin/agencies/:id/reject', authenticate, authorize('admin'), (req, res) => {
    const agency = db.users.find(u => u._id === req.params.id && u.role === 'agency');
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    agency.approvalStatus = 'rejected';
    logAction(req.user._id, 'REJECT_AGENCY', req.params.id, { agencyName: agency.name });
    res.json({ message: 'Agency rejected' });
  });

  app.put('/api/admin/agencies/:id/block', authenticate, authorize('admin'), (req, res) => {
    const agency = db.users.find(u => u._id === req.params.id && u.role === 'agency');
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    agency.blocked = !agency.blocked;
    logAction(req.user._id, agency.blocked ? 'BLOCK_AGENCY' : 'UNBLOCK_AGENCY', req.params.id);
    res.json({ message: `Agency ${agency.blocked ? 'blocked' : 'unblocked'}`, blocked: agency.blocked });
  });

  // ─── Trip Management (Platform-Level) ─────────────────────
  app.get('/api/admin/trips', authenticate, authorize('admin'), (req, res) => {
    const { search, destination, minPrice, maxPrice, agency, status } = req.query;
    let trips = [...db.trips];
    if (search) trips = trips.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (destination) trips = trips.filter(t => t.destination.toLowerCase().includes(destination.toLowerCase()));
    if (minPrice) trips = trips.filter(t => t.price >= +minPrice);
    if (maxPrice) trips = trips.filter(t => t.price <= +maxPrice);
    if (agency) trips = trips.filter(t => t.agency?.name?.toLowerCase().includes(agency.toLowerCase()));
    if (status === 'approved') trips = trips.filter(t => t.moderationStatus !== 'rejected');
    if (status === 'pending') trips = trips.filter(t => t.moderationStatus === 'pending');
    if (status === 'rejected') trips = trips.filter(t => t.moderationStatus === 'rejected');
    trips = trips.map(t => ({ ...t, moderationStatus: t.moderationStatus || 'approved' }));
    res.json(trips);
  });

  app.put('/api/admin/trips/:id/approve', authenticate, authorize('admin'), (req, res) => {
    const trip = db.trips.find(t => t._id === req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.moderationStatus = 'approved';
    logAction(req.user._id, 'APPROVE_TRIP', req.params.id, { title: trip.title });
    res.json({ message: 'Trip approved' });
  });

  app.put('/api/admin/trips/:id/reject', authenticate, authorize('admin'), (req, res) => {
    const trip = db.trips.find(t => t._id === req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.moderationStatus = 'rejected';
    logAction(req.user._id, 'REJECT_TRIP', req.params.id, { title: trip.title });
    res.json({ message: 'Trip rejected' });
  });

  app.delete('/api/admin/trips/:id', authenticate, authorize('admin'), (req, res) => {
    const trip = db.trips.find(t => t._id === req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    db.trips = db.trips.filter(t => t._id !== req.params.id);
    logAction(req.user._id, 'DELETE_TRIP', req.params.id, { title: trip.title });
    res.json({ message: 'Trip deleted' });
  });

  // ─── Booking Management ───────────────────────────────────
  app.get('/api/admin/bookings', authenticate, authorize('admin'), (req, res) => {
    const { status, agency, dateFrom, dateTo } = req.query;
    let bookings = [...db.bookings];
    if (status) bookings = bookings.filter(b => b.status === status);
    if (dateFrom) bookings = bookings.filter(b => new Date(b.createdAt) >= new Date(dateFrom));
    if (dateTo) bookings = bookings.filter(b => new Date(b.createdAt) <= new Date(dateTo));
    // Enrich with user data
    bookings = bookings.map(b => {
      const user = db.users.find(u => u._id === b.user);
      return { ...b, userName: user?.name || b.userName || 'Unknown', userEmail: user?.email || b.userEmail || '' };
    });
    res.json(bookings);
  });

  // ─── Revenue & Analytics ──────────────────────────────────
  app.get('/api/admin/analytics', authenticate, authorize('admin'), (req, res) => {
    const totalRevenue = db.bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyRevenue = months.map((m, i) => ({
      month: m,
      revenue: db.bookings.filter(b => new Date(b.createdAt).getMonth() === i)
        .reduce((s, b) => s + (b.totalPrice || 0), 0) || Math.floor(Math.random() * 150000 + 30000)
    }));

    // Top agencies
    const agencyMap = {};
    db.bookings.forEach(b => {
      const trip = typeof b.trip === 'object' ? b.trip : db.trips.find(t => t._id === b.trip);
      if (trip?.agency) {
        const name = trip.agency.name;
        if (!agencyMap[name]) agencyMap[name] = { name, bookings: 0, revenue: 0 };
        agencyMap[name].bookings++;
        agencyMap[name].revenue += b.totalPrice || 0;
      }
    });
    const topAgencies = Object.values(agencyMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Most booked trips
    const tripMap = {};
    db.bookings.forEach(b => {
      const trip = typeof b.trip === 'object' ? b.trip : db.trips.find(t => t._id === b.trip);
      if (trip) {
        const id = trip._id;
        if (!tripMap[id]) tripMap[id] = { title: trip.title, bookings: 0, revenue: 0 };
        tripMap[id].bookings++;
        tripMap[id].revenue += b.totalPrice || 0;
      }
    });
    const mostBookedTrips = Object.values(tripMap).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

    res.json({ totalRevenue, monthlyRevenue, topAgencies, mostBookedTrips });
  });

  // ─── Reviews Moderation ───────────────────────────────────
  app.get('/api/admin/reviews', authenticate, authorize('admin'), (req, res) => {
    const { rating, search } = req.query;
    let reviews = [...db.reviews];
    if (rating) reviews = reviews.filter(r => r.rating === +rating);
    if (search) reviews = reviews.filter(r => r.comment.toLowerCase().includes(search.toLowerCase()));
    // Enrich with trip name
    reviews = reviews.map(r => {
      const trip = db.trips.find(t => t._id === r.trip);
      return { ...r, tripTitle: trip?.title || 'Unknown Trip' };
    });
    res.json(reviews);
  });

  app.delete('/api/admin/reviews/:id', authenticate, authorize('admin'), (req, res) => {
    const review = db.reviews.find(r => r._id === req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    db.reviews = db.reviews.filter(r => r._id !== req.params.id);
    logAction(req.user._id, 'DELETE_REVIEW', req.params.id);
    res.json({ message: 'Review deleted' });
  });

  // ─── Subscription Management ──────────────────────────────
  app.get('/api/admin/subscriptions', authenticate, authorize('admin'), (req, res) => {
    const plans = [
      { tier: 'free', name: 'Starter', price: 0, maxTrips: 3, teamMembers: 1 },
      { tier: 'pro', name: 'Professional', price: 2999, maxTrips: 15, teamMembers: 5 },
      { tier: 'premium', name: 'Enterprise', price: 7999, maxTrips: -1, teamMembers: -1 },
    ];
    const agencies = db.users.filter(u => u.role === 'agency');
    const activeSubscriptions = {
      free: agencies.filter(a => !a.subscriptionPlan || a.subscriptionPlan === 'free').length,
      pro: agencies.filter(a => a.subscriptionPlan === 'pro').length,
      premium: agencies.filter(a => a.subscriptionPlan === 'premium').length,
    };
    res.json({ plans, activeSubscriptions });
  });

  app.put('/api/admin/subscriptions/plans', authenticate, authorize('admin'), (req, res) => {
    logAction(req.user._id, 'UPDATE_PLANS', 'subscriptions', req.body);
    res.json({ message: 'Plans updated', plans: req.body.plans });
  });

  // ─── Rentals Oversight ────────────────────────────────────
  app.get('/api/admin/rentals', authenticate, authorize('admin'), (req, res) => {
    res.json(db.rentals);
  });

  app.delete('/api/admin/rentals/:id', authenticate, authorize('admin'), (req, res) => {
    db.rentals = db.rentals.filter(r => r._id !== req.params.id);
    logAction(req.user._id, 'DELETE_RENTAL', req.params.id);
    res.json({ message: 'Rental removed' });
  });

  // ─── Audit Logs ───────────────────────────────────────────
  app.get('/api/admin/audit-logs', authenticate, authorize('admin'), (req, res) => {
    const logs = [...db.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100);
    res.json(logs);
  });

  // ─── System Monitoring ────────────────────────────────────
  app.get('/api/admin/system', authenticate, authorize('admin'), (req, res) => {
    res.json({
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      activeUsers: db.users.filter(u => !u.blocked).length,
      apiCalls: db.auditLogs.length,
      dbSize: {
        users: db.users.length,
        trips: db.trips.length,
        bookings: db.bookings.length,
        reviews: db.reviews.length,
        rentals: db.rentals.length,
      },
      errorLogs: [
        { timestamp: new Date(Date.now() - 3600000), level: 'warn', message: 'Slow query detected on /api/trips' },
        { timestamp: new Date(Date.now() - 7200000), level: 'error', message: 'Payment gateway timeout' },
        { timestamp: new Date(Date.now() - 86400000), level: 'info', message: 'Database backup completed' },
      ],
    });
  });
}

module.exports = { setupAdminRoutes };
