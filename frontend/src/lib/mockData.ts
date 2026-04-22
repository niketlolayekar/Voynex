import { Trip, Product, Rental, Booking, Review, User } from '@/types';

export const mockUser: User = {
  _id: 'u1', name: 'Niket Sharma', email: 'niket@voynex.com', role: 'user',
  avatar: '', organization_id: 'org1',
  preferences: { favoriteDestinations: ['Manali', 'Goa'], travelStyle: 'mid-range', interests: ['trekking', 'photography'] },
  createdAt: '2025-01-15'
};

export const mockTrips: Trip[] = [
  {
    _id: 't1', title: 'Mystical Manali & Solang Valley', destination: 'Manali, Himachal Pradesh',
    description: 'Experience the magic of Manali with snow-capped peaks, adventure sports at Solang Valley, and the serene beauty of Old Manali.',
    price: 15999, duration: 5, images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
    activityType: ['adventure', 'nature', 'photography'],
    highlights: ['Solang Valley Snow Sports', 'Old Manali Exploration', 'Hadimba Temple Visit', 'Jogini Waterfall Trek'],
    itinerary: [
      { day: 1, title: 'Arrival & Mall Road', description: 'Arrive in Manali, explore Mall Road', activities: ['Check-in', 'Mall Road walk', 'Local cuisine'] },
      { day: 2, title: 'Solang Valley Adventure', description: 'Full day at Solang Valley', activities: ['Paragliding', 'Zorbing', 'Snow activities'] },
      { day: 3, title: 'Old Manali & Temples', description: 'Cultural exploration', activities: ['Hadimba Temple', 'Manu Temple', 'Old Manali cafes'] },
      { day: 4, title: 'Jogini Waterfall Trek', description: 'Nature trek day', activities: ['Trek to Jogini Falls', 'Picnic lunch', 'Photography'] },
      { day: 5, title: 'Departure', description: 'Morning at leisure, departure', activities: ['Shopping', 'Departure'] },
    ],
    agency: { _id: 'a1', name: 'Himalayan Trails' }, organization_id: 'org1',
    rating: 4.7, reviewCount: 128, maxGroupSize: 20, difficulty: 'moderate',
    included: ['Hotel stay', 'Breakfast & Dinner', 'Transport', 'Activity charges'],
    excluded: ['Flights', 'Lunch', 'Personal expenses'], startDates: ['2026-05-15', '2026-06-01', '2026-06-15'],
    createdAt: '2025-10-01'
  },
  {
    _id: 't2', title: 'Goa Beach Paradise', destination: 'Goa',
    description: 'Sun, sand, and sea — discover the vibrant beach culture of Goa with water sports, nightlife, and Portuguese heritage.',
    price: 12499, duration: 4, images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'],
    activityType: ['beach', 'nightlife', 'water-sports'],
    highlights: ['Baga Beach', 'Dudhsagar Falls', 'Old Goa Churches', 'Water Sports'],
    itinerary: [
      { day: 1, title: 'Arrival & North Goa', description: 'Beach day', activities: ['Baga Beach', 'Calangute', 'Sunset cruise'] },
      { day: 2, title: 'Water Sports & Nightlife', description: 'Adventure day', activities: ['Jet skiing', 'Parasailing', 'Club night'] },
      { day: 3, title: 'South Goa & Heritage', description: 'Culture day', activities: ['Basilica of Bom Jesus', 'Palolem Beach', 'Spice plantation'] },
      { day: 4, title: 'Departure', description: 'Leisure morning', activities: ['Flea market', 'Departure'] },
    ],
    agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org1',
    rating: 4.5, reviewCount: 256, maxGroupSize: 25, difficulty: 'easy',
    included: ['Resort stay', 'Breakfast', 'Water sports', 'Sightseeing'],
    excluded: ['Flights', 'Lunch & Dinner', 'Nightlife expenses'], startDates: ['2026-05-01', '2026-05-20'],
    createdAt: '2025-09-15'
  },
  {
    _id: 't3', title: 'Royal Rajasthan Circuit', destination: 'Rajasthan',
    description: 'Journey through the land of kings — explore majestic forts, vibrant bazaars, and golden deserts across Jaipur, Udaipur, and Jaisalmer.',
    price: 24999, duration: 7, images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80'],
    activityType: ['culture', 'heritage', 'photography'],
    highlights: ['Amber Fort', 'Lake Palace', 'Desert Safari', 'City Palace'],
    itinerary: [
      { day: 1, title: 'Jaipur Arrival', description: 'Pink City exploration', activities: ['Hawa Mahal', 'City Palace', 'Jantar Mantar'] },
      { day: 2, title: 'Amber Fort & Markets', description: 'Fort visit', activities: ['Amber Fort', 'Johari Bazaar', 'Elephant ride'] },
      { day: 3, title: 'Travel to Udaipur', description: 'Lake City', activities: ['Travel', 'Lake Pichola sunset'] },
      { day: 4, title: 'Udaipur Exploration', description: 'Palace day', activities: ['City Palace', 'Saheliyon ki Bari', 'Boat ride'] },
      { day: 5, title: 'Travel to Jaisalmer', description: 'Golden City', activities: ['Travel', 'Jaisalmer Fort'] },
      { day: 6, title: 'Desert Safari', description: 'Sand dunes', activities: ['Camel safari', 'Desert camping', 'Folk dance'] },
      { day: 7, title: 'Departure', description: 'Morning at leisure', activities: ['Shopping', 'Departure'] },
    ],
    agency: { _id: 'a1', name: 'Himalayan Trails' }, organization_id: 'org1',
    rating: 4.8, reviewCount: 89, maxGroupSize: 15, difficulty: 'easy',
    included: ['Heritage hotels', 'All meals', 'AC transport', 'Guide', 'Desert camping'],
    excluded: ['Flights', 'Tips', 'Camera charges'], startDates: ['2026-10-01', '2026-11-15', '2026-12-01'],
    createdAt: '2025-11-01'
  },
  {
    _id: 't4', title: 'Kerala Backwaters Bliss', destination: 'Kerala',
    description: 'Float through the tranquil backwaters of Kerala, experience Ayurvedic spa treatments, and explore lush tea plantations in Munnar.',
    price: 18999, duration: 6, images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'],
    activityType: ['nature', 'wellness', 'culture'],
    highlights: ['Houseboat Stay', 'Munnar Tea Gardens', 'Kathakali Show', 'Ayurvedic Spa'],
    itinerary: [
      { day: 1, title: 'Kochi Arrival', description: 'Heritage walk', activities: ['Fort Kochi', 'Chinese fishing nets', 'Jewish Synagogue'] },
      { day: 2, title: 'Munnar', description: 'Hill station', activities: ['Tea gardens', 'Eravikulam Park', 'Mattupetty Dam'] },
      { day: 3, title: 'Munnar to Thekkady', description: 'Wildlife', activities: ['Spice plantation', 'Periyar boat ride'] },
      { day: 4, title: 'Alleppey Backwaters', description: 'Houseboat', activities: ['Houseboat cruise', 'Village walk', 'Sunset'] },
      { day: 5, title: 'Kovalam Beach', description: 'Relax', activities: ['Beach', 'Ayurvedic massage', 'Lighthouse'] },
      { day: 6, title: 'Departure', description: 'Departure from Trivandrum', activities: ['Shopping', 'Departure'] },
    ],
    agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org1',
    rating: 4.9, reviewCount: 67, maxGroupSize: 12, difficulty: 'easy',
    included: ['All stays', 'Houseboat', 'Meals', 'Transport', 'Spa session'],
    excluded: ['Flights', 'Tips', 'Personal shopping'], startDates: ['2026-08-01', '2026-09-15'],
    createdAt: '2025-12-01'
  },
  {
    _id: 't5', title: 'Ladakh Adventure Expedition', destination: 'Ladakh',
    description: 'Conquer the highest motorable passes, camp by pristine lakes, and experience the raw beauty of Ladakh.',
    price: 29999, duration: 8, images: ['https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80'],
    activityType: ['adventure', 'nature', 'photography'],
    highlights: ['Pangong Lake', 'Khardung La', 'Nubra Valley', 'Magnetic Hill'],
    itinerary: [
      { day: 1, title: 'Leh Arrival', description: 'Acclimatization', activities: ['Rest', 'Leh Palace', 'Shanti Stupa'] },
      { day: 2, title: 'Leh Sightseeing', description: 'Local exploration', activities: ['Magnetic Hill', 'Gurudwara Pathar Sahib', 'Hall of Fame'] },
      { day: 3, title: 'Nubra Valley', description: 'Desert in mountains', activities: ['Khardung La', 'Diskit Monastery', 'Sand dunes'] },
      { day: 4, title: 'Nubra Valley', description: 'Exploration', activities: ['Turtuk village', 'Double-humped camels'] },
      { day: 5, title: 'Pangong Lake', description: 'Iconic lake', activities: ['Drive to Pangong', 'Lakeside camping', 'Stargazing'] },
      { day: 6, title: 'Pangong to Leh', description: 'Return journey', activities: ['Chang La', 'Hemis Monastery'] },
      { day: 7, title: 'Rafting & Markets', description: 'Adventure', activities: ['Zanskar River rafting', 'Leh market'] },
      { day: 8, title: 'Departure', description: 'Farewell', activities: ['Departure'] },
    ],
    agency: { _id: 'a1', name: 'Himalayan Trails' }, organization_id: 'org1',
    rating: 4.6, reviewCount: 43, maxGroupSize: 10, difficulty: 'challenging',
    included: ['Camps & Hotels', 'All meals', 'Permits', 'Oxygen cylinder', 'Transport'],
    excluded: ['Flights', 'Insurance', 'Rafting (optional)'], startDates: ['2026-06-15', '2026-07-01', '2026-07-15'],
    createdAt: '2025-11-15'
  },
  {
    _id: 't6', title: 'Andaman Tropical Escape', destination: 'Andaman Islands',
    description: 'Dive into crystal-clear waters, explore coral reefs, and relax on pristine white-sand beaches of the Andaman Islands.',
    price: 22499, duration: 5, images: ['https://images.unsplash.com/photo-1589136777351-fdc9c606132e?w=800&q=80'],
    activityType: ['beach', 'water-sports', 'nature'],
    highlights: ['Radhanagar Beach', 'Scuba Diving', 'Cellular Jail', 'Ross Island'],
    itinerary: [
      { day: 1, title: 'Port Blair', description: 'Arrival', activities: ['Cellular Jail', 'Light & Sound Show'] },
      { day: 2, title: 'Havelock Island', description: 'Beach paradise', activities: ['Radhanagar Beach', 'Snorkeling'] },
      { day: 3, title: 'Scuba Diving', description: 'Underwater world', activities: ['Scuba diving', 'Elephant Beach'] },
      { day: 4, title: 'Neil Island', description: 'Coral reefs', activities: ['Natural bridge', 'Glass-bottom boat'] },
      { day: 5, title: 'Departure', description: 'Return to Port Blair', activities: ['Shopping', 'Departure'] },
    ],
    agency: { _id: 'a2', name: 'Coastal Escapes' }, organization_id: 'org1',
    rating: 4.7, reviewCount: 95, maxGroupSize: 18, difficulty: 'easy',
    included: ['Ferry tickets', 'Hotels', 'Breakfast & Dinner', 'Water sports'],
    excluded: ['Flights', 'Lunch', 'Scuba gear rental'], startDates: ['2026-10-01', '2026-11-01', '2026-12-15'],
    createdAt: '2026-01-01'
  },
];

export const mockProducts: Product[] = [
  { _id: 'p1', name: 'Alpine Waterproof Jacket', description: 'Windproof and waterproof jacket for extreme conditions', price: 3499, category: 'jackets', images: ['/shop/jacket1.jpg'], stock: 45, rating: 4.5, reviewCount: 67 },
  { _id: 'p2', name: 'Trek-Pro Hiking Backpack 60L', description: 'Ergonomic backpack with rain cover', price: 4299, category: 'bags', images: ['/shop/backpack.jpg'], stock: 30, rating: 4.8, reviewCount: 112 },
  { _id: 'p3', name: 'Polarized Adventure Sunglasses', description: 'UV400 protection with anti-glare coating', price: 1299, category: 'accessories', images: ['/shop/sunglasses.jpg'], stock: 80, rating: 4.3, reviewCount: 45 },
  { _id: 'p4', name: 'GoPro Hero 12 Black', description: '5.3K video, HyperSmooth stabilization', price: 44999, category: 'electronics', images: ['/shop/gopro.jpg'], stock: 15, rating: 4.9, reviewCount: 203 },
  { _id: 'p5', name: 'Thermal Base Layer Set', description: 'Merino wool blend for extreme cold', price: 2199, category: 'gear', images: ['/shop/thermal.jpg'], stock: 60, rating: 4.6, reviewCount: 34 },
  { _id: 'p6', name: 'Travel Neck Pillow Premium', description: 'Memory foam with cooling gel', price: 899, category: 'accessories', images: ['/shop/pillow.jpg'], stock: 100, rating: 4.4, reviewCount: 89 },
  { _id: 'p7', name: 'Fleece-Lined Trekking Pants', description: 'Stretchable, water-resistant trekking pants', price: 1899, category: 'gear', images: ['/shop/pants.jpg'], stock: 55, rating: 4.5, reviewCount: 58 },
  { _id: 'p8', name: 'Compact Travel First Aid Kit', description: 'Essential medical supplies for travelers', price: 699, category: 'accessories', images: ['/shop/firstaid.jpg'], stock: 200, rating: 4.7, reviewCount: 76 },
];

export const mockRentals: Rental[] = [
  { _id: 'r1', name: 'Royal Enfield Himalayan', type: 'bike', pricePerDay: 1500, location: 'Manali', images: ['/rentals/himalayan.jpg'], available: true, description: 'Perfect for mountain roads', features: ['411cc', 'ABS', 'Luggage rack', 'Phone mount'] },
  { _id: 'r2', name: 'Honda Activa 6G', type: 'scooty', pricePerDay: 500, location: 'Goa', images: ['/rentals/activa.jpg'], available: true, description: 'Easy to ride for beach hopping', features: ['110cc', 'Automatic', 'Storage box', 'USB charger'] },
  { _id: 'r3', name: 'Maruti Swift Dzire', type: 'car', pricePerDay: 2500, location: 'Rajasthan', images: ['/rentals/swift.jpg'], available: true, description: 'Comfortable sedan for family trips', features: ['AC', 'Power steering', 'Music system', '5 seater'] },
  { _id: 'r4', name: 'GoPro Hero 12 Rental', type: 'gopro', pricePerDay: 800, location: 'All locations', images: ['/rentals/gopro.jpg'], available: true, description: 'Capture every moment in 5.3K', features: ['5.3K video', 'Waterproof', 'Stabilization', 'Accessories kit'] },
  { _id: 'r5', name: 'KTM Duke 390', type: 'bike', pricePerDay: 2000, location: 'Ladakh', images: ['/rentals/ktm.jpg'], available: true, description: 'Powerful bike for high-altitude rides', features: ['373cc', 'ABS', 'Slipper clutch', 'LED lights'] },
  { _id: 'r6', name: 'Toyota Innova Crysta', type: 'car', pricePerDay: 4500, location: 'Kerala', images: ['/rentals/innova.jpg'], available: false, description: 'Premium MPV for group travel', features: ['AC', '7 seater', 'Captain seats', 'Diesel'] },
];

export const mockBookings: Booking[] = [
  { _id: 'b1', trip: mockTrips[0], user: 'u1', startDate: '2026-05-15', guests: 3, totalPrice: 47997, status: 'confirmed', paymentId: 'pay_abc123', groupComposition: { adults: 2, children: 1, seniors: 0 }, createdAt: '2026-04-01' },
  { _id: 'b2', trip: mockTrips[1], user: 'u1', startDate: '2026-05-01', guests: 2, totalPrice: 24998, status: 'pending', groupComposition: { adults: 2, children: 0, seniors: 0 }, createdAt: '2026-04-10' },
  { _id: 'b3', trip: mockTrips[3], user: 'u1', startDate: '2026-08-01', guests: 4, totalPrice: 75996, status: 'completed', paymentId: 'pay_def456', groupComposition: { adults: 2, children: 1, seniors: 1 }, createdAt: '2025-07-01' },
];

export const mockReviews: Review[] = [
  { _id: 'rev1', trip: 't1', user: { _id: 'u2', name: 'Priya Patel' }, rating: 5, comment: 'Absolutely magical experience! The Solang Valley was breathtaking.', createdAt: '2026-03-15' },
  { _id: 'rev2', trip: 't1', user: { _id: 'u3', name: 'Rahul Verma' }, rating: 4, comment: 'Great trip, well organized. Could improve the hotel quality.', createdAt: '2026-03-10' },
  { _id: 'rev3', trip: 't2', user: { _id: 'u4', name: 'Ananya Singh' }, rating: 5, comment: 'Best Goa trip ever! Water sports were incredible.', createdAt: '2026-02-20' },
  { _id: 'rev4', trip: 't3', user: { _id: 'u5', name: 'Vikram Joshi' }, rating: 5, comment: 'Rajasthan is truly the land of kings. Unforgettable desert safari!', createdAt: '2026-01-25' },
  { _id: 'rev5', trip: 't4', user: { _id: 'u6', name: 'Meera Nair' }, rating: 5, comment: 'The houseboat experience in Alleppey was beyond words. Pure bliss!', createdAt: '2026-02-05' },
  { _id: 'rev6', trip: 't1', user: { _id: 'u7', name: 'Arjun Kapoor' }, rating: 3, comment: 'Good trip but the weather was not cooperative. Guide was helpful though.', createdAt: '2026-01-18' },
  { _id: 'rev7', trip: 't2', user: { _id: 'u8', name: 'Sneha Reddy' }, rating: 4, comment: 'Loved the beaches and water sports. Hotel could be better for the price.', createdAt: '2026-03-05' },
  { _id: 'rev8', trip: 't5', user: { _id: 'u9', name: 'Karan Mehta' }, rating: 5, comment: 'Life-changing experience! Pangong Lake was surreal. Worth every penny.', createdAt: '2026-02-28' },
  { _id: 'rev9', trip: 't3', user: { _id: 'u10', name: 'Diya Sharma' }, rating: 4, comment: 'Beautiful forts and palaces. Desert camping was the highlight!', createdAt: '2026-03-20' },
  { _id: 'rev10', trip: 't6', user: { _id: 'u11', name: 'Rohan Das' }, rating: 5, comment: 'Pristine beaches and amazing scuba diving. Highly recommended!', createdAt: '2026-04-01' },
];

// ─── Agency Portal Mock Data ─────────────────────────────────

import { TeamMember, AgencyBooking, AgencyRental, SubscriptionPlan, AgencyStats } from '@/types';

export const mockTeamMembers: TeamMember[] = [
  { _id: 'tm1', name: 'Rajesh Kumar', email: 'rajesh@himalayan.com', role: 'admin', joinedAt: '2024-06-15', status: 'active' },
  { _id: 'tm2', name: 'Priya Sharma', email: 'priya@himalayan.com', role: 'staff', joinedAt: '2024-09-20', status: 'active' },
  { _id: 'tm3', name: 'Amit Singh', email: 'amit@himalayan.com', role: 'staff', joinedAt: '2025-01-10', status: 'active' },
  { _id: 'tm4', name: 'Neha Gupta', email: 'neha@himalayan.com', role: 'staff', joinedAt: '2025-06-01', status: 'invited' },
];

export const mockAgencyBookings: AgencyBooking[] = [
  { _id: 'ab1', trip: mockTrips[0], user: 'u2', userName: 'Priya Patel', userEmail: 'priya@gmail.com', userPhone: '+91 98765 43210', startDate: '2026-05-15', guests: 3, totalPrice: 47997, status: 'confirmed', paymentStatus: 'paid', paymentId: 'pay_abc123', groupComposition: { adults: 2, children: 1, seniors: 0 }, createdAt: '2026-04-01' },
  { _id: 'ab2', trip: mockTrips[1], user: 'u3', userName: 'Rahul Verma', userEmail: 'rahul@outlook.com', startDate: '2026-05-01', guests: 2, totalPrice: 24998, status: 'pending', paymentStatus: 'pending', groupComposition: { adults: 2, children: 0, seniors: 0 }, createdAt: '2026-04-10' },
  { _id: 'ab3', trip: mockTrips[2], user: 'u4', userName: 'Ananya Singh', userEmail: 'ananya@gmail.com', userPhone: '+91 87654 32109', startDate: '2026-10-01', guests: 4, totalPrice: 99996, status: 'confirmed', paymentStatus: 'paid', paymentId: 'pay_ghi789', groupComposition: { adults: 2, children: 1, seniors: 1 }, createdAt: '2026-04-05' },
  { _id: 'ab4', trip: mockTrips[3], user: 'u5', userName: 'Vikram Joshi', userEmail: 'vikram@yahoo.com', startDate: '2026-08-01', guests: 4, totalPrice: 75996, status: 'completed', paymentStatus: 'paid', paymentId: 'pay_def456', groupComposition: { adults: 2, children: 1, seniors: 1 }, createdAt: '2025-07-01' },
  { _id: 'ab5', trip: mockTrips[4], user: 'u6', userName: 'Meera Nair', userEmail: 'meera@gmail.com', startDate: '2026-06-15', guests: 2, totalPrice: 59998, status: 'confirmed', paymentStatus: 'paid', paymentId: 'pay_jkl012', groupComposition: { adults: 2, children: 0, seniors: 0 }, createdAt: '2026-03-28' },
  { _id: 'ab6', trip: mockTrips[0], user: 'u7', userName: 'Arjun Kapoor', userEmail: 'arjun@hotmail.com', userPhone: '+91 76543 21098', startDate: '2026-06-01', guests: 5, totalPrice: 79995, status: 'pending', paymentStatus: 'pending', groupComposition: { adults: 3, children: 2, seniors: 0 }, createdAt: '2026-04-15' },
  { _id: 'ab7', trip: mockTrips[5], user: 'u8', userName: 'Sneha Reddy', userEmail: 'sneha@gmail.com', startDate: '2026-10-01', guests: 2, totalPrice: 44998, status: 'cancelled', paymentStatus: 'refunded', groupComposition: { adults: 2, children: 0, seniors: 0 }, createdAt: '2026-03-10', notes: 'Customer requested cancellation due to schedule change' },
  { _id: 'ab8', trip: mockTrips[2], user: 'u9', userName: 'Karan Mehta', userEmail: 'karan@gmail.com', startDate: '2026-11-15', guests: 6, totalPrice: 149994, status: 'confirmed', paymentStatus: 'paid', paymentId: 'pay_mno345', groupComposition: { adults: 4, children: 1, seniors: 1 }, createdAt: '2026-04-18' },
];

export const mockAgencyRentals: AgencyRental[] = [
  { _id: 'ar1', name: 'Royal Enfield Himalayan', type: 'bike', pricePerDay: 1500, location: 'Manali', images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'], available: true, description: 'Perfect for mountain roads and long rides', features: ['411cc', 'ABS', 'Luggage rack', 'Phone mount'], linkedTripIds: ['t1', 't5'], organization_id: 'org1' },
  { _id: 'ar2', name: 'Honda Activa 6G', type: 'scooty', pricePerDay: 500, location: 'Goa', images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'], available: true, description: 'Easy to ride for beach hopping', features: ['110cc', 'Automatic', 'Storage box', 'USB charger'], linkedTripIds: ['t2'], organization_id: 'org1' },
  { _id: 'ar3', name: 'Maruti Swift Dzire', type: 'car', pricePerDay: 2500, location: 'Rajasthan', images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'], available: true, description: 'Comfortable sedan for family trips', features: ['AC', 'Power steering', 'Music system', '5 seater'], linkedTripIds: ['t3'], organization_id: 'org1' },
  { _id: 'ar4', name: 'GoPro Hero 12 Rental', type: 'gopro', pricePerDay: 800, location: 'All Locations', images: ['https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80'], available: true, description: 'Capture every moment in 5.3K', features: ['5.3K video', 'Waterproof', 'Stabilization', 'Accessories kit'], linkedTripIds: ['t1', 't2', 't5', 't6'], organization_id: 'org1' },
  { _id: 'ar5', name: 'KTM Duke 390', type: 'bike', pricePerDay: 2000, location: 'Ladakh', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80'], available: true, description: 'Powerful bike for high-altitude rides', features: ['373cc', 'ABS', 'Slipper clutch', 'LED lights'], linkedTripIds: ['t5'], organization_id: 'org1' },
  { _id: 'ar6', name: 'Toyota Innova Crysta', type: 'car', pricePerDay: 4500, location: 'Kerala', images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80'], available: false, description: 'Premium MPV for group travel', features: ['AC', '7 seater', 'Captain seats', 'Diesel'], linkedTripIds: ['t4'], organization_id: 'org1' },
  { _id: 'ar7', name: 'Bajaj Avenger 220', type: 'bike', pricePerDay: 1200, location: 'Goa', images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80'], available: true, description: 'Cruiser bike perfect for coastal roads', features: ['220cc', 'Cruiser style', 'Long seat', 'Disc brake'], linkedTripIds: ['t2'], organization_id: 'org1' },
  { _id: 'ar8', name: 'DJI Osmo Action 4', type: 'gopro', pricePerDay: 600, location: 'Manali', images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'], available: true, description: 'Budget action camera alternative', features: ['4K video', 'Waterproof', 'Dual screen', 'Long battery'], linkedTripIds: ['t1', 't3'], organization_id: 'org1' },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  { tier: 'free', name: 'Starter', price: 0, maxTrips: 3, analyticsAccess: false, teamMembers: 1, rentalsAccess: false, prioritySupport: false, features: ['Up to 3 trips', 'Basic booking management', 'Email support', 'Public listing'] },
  { tier: 'pro', name: 'Professional', price: 2999, maxTrips: 15, analyticsAccess: true, teamMembers: 5, rentalsAccess: true, prioritySupport: false, features: ['Up to 15 trips', 'Advanced analytics', 'Rental management', '5 team members', 'Priority listing', 'Chat support'] },
  { tier: 'premium', name: 'Enterprise', price: 7999, maxTrips: -1, analyticsAccess: true, teamMembers: -1, rentalsAccess: true, prioritySupport: true, features: ['Unlimited trips', 'Full analytics suite', 'Unlimited rentals', 'Unlimited team members', 'Featured listing', '24/7 priority support', 'Custom branding', 'API access'] },
];

export const mockAgencyStats: AgencyStats = {
  totalTrips: 6,
  totalBookings: 8,
  revenue: 583972,
  averageRating: 4.7,
  activeTrips: 5,
  inactiveTrips: 1,
  monthlyBookings: [
    { month: 'Nov', count: 8 }, { month: 'Dec', count: 12 }, { month: 'Jan', count: 15 },
    { month: 'Feb', count: 22 }, { month: 'Mar', count: 28 }, { month: 'Apr', count: 35 },
  ],
  monthlyRevenue: [
    { month: 'Nov', revenue: 45000 }, { month: 'Dec', revenue: 68000 }, { month: 'Jan', revenue: 82000 },
    { month: 'Feb', revenue: 95000 }, { month: 'Mar', revenue: 125000 }, { month: 'Apr', revenue: 168972 },
  ],
  topTrips: [
    { name: 'Royal Rajasthan Circuit', bookings: 45, revenue: 224955 },
    { name: 'Mystical Manali & Solang', bookings: 38, revenue: 151981 },
    { name: 'Ladakh Expedition', bookings: 22, revenue: 131978 },
    { name: 'Kerala Backwaters', bookings: 18, revenue: 75996 },
  ],
};

