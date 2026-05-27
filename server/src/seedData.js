export const CATEGORIES = [
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'videography', name: 'Videography', icon: 'videocam' },
  { id: 'music-dj', name: 'Music & DJ', icon: 'musical-notes' },
  { id: 'makeup', name: 'Makeup & Beauty', icon: 'color-palette' },
  { id: 'design', name: 'Graphic Design', icon: 'brush' },
  { id: 'fashion', name: 'Fashion & Styling', icon: 'shirt' },
  { id: 'events', name: 'Event Planning', icon: 'sparkles' },
  { id: 'art', name: 'Painting & Art', icon: 'image' },
  { id: 'content', name: 'Content Creation', icon: 'phone-portrait' },
  { id: 'dance', name: 'Dance & Performance', icon: 'body' },
];

export const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape',
];

export const CREATIVES = [
  {
    id: 'c1', name: 'Thabo Mokoena', tagline: 'Weddings, portraits & lifestyle',
    categoryId: 'photography', province: 'Gauteng', city: 'Johannesburg',
    avatar: 'https://i.pravatar.cc/400?img=12', startingPrice: 2500, likes: 1284,
    bio: 'Joburg-based photographer with 8 years capturing love stories and brand campaigns across Gauteng. Natural light is my signature.',
    services: [
      { id: 's1', title: 'Half-day Wedding Shoot', description: '5 hours of coverage, edited gallery of 200+ photos.', price: 7500 },
      { id: 's2', title: 'Studio Portrait Session', description: '1 hour studio session, 15 retouched images.', price: 2500 },
      { id: 's3', title: 'Brand Lifestyle Shoot', description: 'On-location half day for products and team.', price: 5000 },
    ],
    reviews: [
      { id: 'r1', author: 'Naledi P.', rating: 5, comment: 'Thabo made our wedding day effortless. The photos are art!', date: '2026-03-14' },
      { id: 'r2', author: 'Sipho M.', rating: 5, comment: 'Professional and so easy to work with. Highly recommend.', date: '2026-02-02' },
      { id: 'r3', author: 'Kerry-Ann', rating: 4, comment: 'Lovely portraits, delivery took a few extra days.', date: '2026-01-20' },
    ],
  },
  {
    id: 'c2', name: 'Lerato Dlamini', tagline: 'Cinematic event films',
    categoryId: 'videography', province: 'Gauteng', city: 'Pretoria',
    avatar: 'https://i.pravatar.cc/400?img=47', startingPrice: 4000, likes: 642,
    bio: 'Storyteller behind the lens. I shoot cinematic wedding films, music videos and corporate documentaries in 4K.',
    services: [
      { id: 's1', title: 'Wedding Highlight Film', description: '3-5 minute cinematic edit with licensed music.', price: 9000 },
      { id: 's2', title: 'Music Video', description: 'Concept, shoot and edit for one track.', price: 12000 },
      { id: 's3', title: 'Corporate Promo', description: '60-second branded promo video.', price: 4000 },
    ],
    reviews: [
      { id: 'r1', author: 'Bongani K.', rating: 5, comment: 'Our highlight film gives me chills every time. Worth every cent.', date: '2026-04-01' },
      { id: 'r2', author: 'Zinhle', rating: 4, comment: 'Great quality, communication could be a touch faster.', date: '2026-03-11' },
    ],
  },
  {
    id: 'c3', name: 'Aisha Patel', tagline: 'Bridal & editorial makeup artist',
    categoryId: 'makeup', province: 'KwaZulu-Natal', city: 'Durban',
    avatar: 'https://i.pravatar.cc/400?img=45', startingPrice: 1200, likes: 2031,
    bio: 'Durban MUA specialising in bridal, traditional and editorial looks for all skin tones. I bring the glam to you.',
    services: [
      { id: 's1', title: 'Bridal Makeup', description: 'Trial + wedding day application with lashes.', price: 3500 },
      { id: 's2', title: 'Event Glam', description: 'Full face for matric dances and parties.', price: 1200 },
      { id: 's3', title: 'Group Booking (4)', description: 'Bridal party of four, on location.', price: 4200 },
    ],
    reviews: [
      { id: 'r1', author: 'Fatima', rating: 5, comment: 'My makeup lasted from morning to midnight. Flawless!', date: '2026-05-02' },
      { id: 'r2', author: 'Anele', rating: 5, comment: 'She understood exactly the soft glam I wanted.', date: '2026-04-18' },
      { id: 'r3', author: 'Reshma', rating: 5, comment: 'Best MUA in Durban, full stop.', date: '2026-03-30' },
    ],
  },
  {
    id: 'c4', name: 'DJ Khaya', tagline: 'Amapiano, house & weddings',
    categoryId: 'music-dj', province: 'Western Cape', city: 'Cape Town',
    avatar: 'https://i.pravatar.cc/400?img=33', startingPrice: 3000, likes: 918,
    bio: 'Reading the room is my superpower. Amapiano, house, kwaito and the classics — I keep the dance floor full all night.',
    services: [
      { id: 's1', title: 'Wedding DJ Package', description: '6 hours, full sound system and lighting.', price: 8000 },
      { id: 's2', title: 'Private Party', description: '4 hour set with own decks.', price: 3000 },
      { id: 's3', title: 'Club Guest Set', description: '90 minute curated set.', price: 3500 },
    ],
    reviews: [
      { id: 'r1', author: 'Lwazi', rating: 5, comment: 'Nobody sat down. Incredible energy!', date: '2026-04-22' },
      { id: 'r2', author: 'Megan', rating: 4, comment: 'Great vibes, arrived a little late to set up.', date: '2026-02-15' },
    ],
  },
  {
    id: 'c5', name: 'Sive Nkosi', tagline: 'Brand identity & logo design',
    categoryId: 'design', province: 'Western Cape', city: 'Cape Town',
    avatar: 'https://i.pravatar.cc/400?img=15', startingPrice: 1500, likes: 503,
    bio: 'I help small businesses look like big brands. Logos, brand kits and social media templates with a clean, bold style.',
    services: [
      { id: 's1', title: 'Logo Design', description: '3 concepts, 2 revisions, full file pack.', price: 1500 },
      { id: 's2', title: 'Brand Identity Kit', description: 'Logo, colour palette, fonts and guidelines.', price: 4500 },
      { id: 's3', title: 'Social Media Pack', description: '12 editable post templates.', price: 1800 },
    ],
    reviews: [
      { id: 'r1', author: 'Tumi', rating: 5, comment: 'My brand finally feels professional. Thank you!', date: '2026-03-09' },
      { id: 'r2', author: 'David O.', rating: 4, comment: 'Solid work and patient with my feedback.', date: '2026-01-28' },
    ],
  },
  {
    id: 'c6', name: 'Nomvula Zwane', tagline: 'Personal stylist & wardrobe curator',
    categoryId: 'fashion', province: 'Gauteng', city: 'Sandton',
    avatar: 'https://i.pravatar.cc/400?img=20', startingPrice: 900, likes: 377,
    bio: 'From boardroom to red carpet, I curate looks that tell your story. Personal shopping and wardrobe edits.',
    services: [
      { id: 's1', title: 'Wardrobe Edit', description: 'In-home declutter and outfit building session.', price: 1500 },
      { id: 's2', title: 'Personal Shopping', description: '3 hour guided shopping trip.', price: 900 },
      { id: 's3', title: 'Event Styling', description: 'Head-to-toe look for a special occasion.', price: 2200 },
    ],
    reviews: [
      { id: 'r1', author: 'Palesa', rating: 5, comment: 'I feel confident in everything I own now.', date: '2026-04-05' },
      { id: 'r2', author: 'Jenna', rating: 4, comment: 'Great eye, would book again for events.', date: '2026-02-19' },
    ],
  },
  {
    id: 'c7', name: 'Themba Events Co.', tagline: 'Full-service event planning',
    categoryId: 'events', province: 'Eastern Cape', city: 'Gqeberha',
    avatar: 'https://i.pravatar.cc/400?img=51', startingPrice: 5000, likes: 289,
    bio: 'We plan weddings, launches and conferences end to end. Decor, catering coordination and on-the-day management.',
    services: [
      { id: 's1', title: 'Day-of Coordination', description: 'On-site management for your event day.', price: 5000 },
      { id: 's2', title: 'Full Wedding Planning', description: '6 months of planning and vendor sourcing.', price: 25000 },
      { id: 's3', title: 'Decor & Styling', description: 'Theme design and full venue styling.', price: 12000 },
    ],
    reviews: [
      { id: 'r1', author: 'Lindiwe', rating: 5, comment: 'Stress-free wedding thanks to this team.', date: '2026-03-21' },
      { id: 'r2', author: 'Marco', rating: 4, comment: 'Well organised, minor hiccup with seating.', date: '2026-01-15' },
    ],
  },
  {
    id: 'c8', name: 'Karabo Maleka', tagline: 'Contemporary African painter',
    categoryId: 'art', province: 'Free State', city: 'Bloemfontein',
    avatar: 'https://i.pravatar.cc/400?img=60', startingPrice: 1800, likes: 432,
    bio: 'I paint bold, colourful portraits celebrating African heritage. Commissions and live event painting welcome.',
    services: [
      { id: 's1', title: 'Custom Portrait', description: 'A2 acrylic portrait from your photo.', price: 3500 },
      { id: 's2', title: 'Live Event Painting', description: 'Paint your event live as it happens.', price: 4500 },
      { id: 's3', title: 'Small Commission', description: 'A4 piece, your concept.', price: 1800 },
    ],
    reviews: [
      { id: 'r1', author: 'Boitumelo', rating: 5, comment: 'The portrait of my gogo brought me to tears.', date: '2026-02-27' },
      { id: 'r2', author: 'Hannah', rating: 4, comment: 'Beautiful piece, delivery to JHB took a while.', date: '2026-01-09' },
    ],
  },
  {
    id: 'c9', name: 'Refilwe Content', tagline: 'UGC & social media content',
    categoryId: 'content', province: 'Gauteng', city: 'Johannesburg',
    avatar: 'https://i.pravatar.cc/400?img=44', startingPrice: 1200, likes: 765,
    bio: 'Scroll-stopping short-form video for brands. TikTok, Reels and YouTube Shorts that actually convert.',
    services: [
      { id: 's1', title: 'UGC Video x3', description: '3 vertical videos for your product.', price: 1200 },
      { id: 's2', title: 'Monthly Content', description: '12 posts + 4 reels managed monthly.', price: 6500 },
      { id: 's3', title: 'Reel Strategy Call', description: '1 hour content strategy session.', price: 800 },
    ],
    reviews: [
      { id: 'r1', author: 'Ayanda', rating: 5, comment: 'My engagement tripled in a month!', date: '2026-04-30' },
      { id: 'r2', author: 'Pieter', rating: 4, comment: 'Creative ideas, fast turnaround.', date: '2026-03-02' },
    ],
  },
  {
    id: 'c10', name: 'Tshepo Films', tagline: 'Drone & landscape videography',
    categoryId: 'videography', province: 'Mpumalanga', city: 'Nelspruit',
    avatar: 'https://i.pravatar.cc/400?img=68', startingPrice: 3500, likes: 511,
    bio: 'Licensed drone pilot capturing the beauty of Mpumalanga. Lodges, weddings and tourism content a speciality.',
    services: [
      { id: 's1', title: 'Aerial Property Reel', description: 'Drone footage edit for lodges and venues.', price: 3500 },
      { id: 's2', title: 'Wedding Drone Add-on', description: 'Aerial coverage for your event.', price: 4000 },
      { id: 's3', title: 'Tourism Promo', description: '90-second destination video.', price: 9000 },
    ],
    reviews: [
      { id: 'r1', author: 'Kruger Lodge', rating: 5, comment: 'Bookings went up after we used the reel.', date: '2026-04-12' },
      { id: 'r2', author: 'Sanele', rating: 5, comment: 'Stunning shots of the Lowveld.', date: '2026-02-08' },
    ],
  },
  {
    id: 'c11', name: 'Gugu Mthembu', tagline: 'Newborn & family photography',
    categoryId: 'photography', province: 'KwaZulu-Natal', city: 'Pietermaritzburg',
    avatar: 'https://i.pravatar.cc/400?img=24', startingPrice: 1800, likes: 876,
    bio: 'Gentle, patient newborn and family photographer. Safe, calm sessions and timeless edits.',
    services: [
      { id: 's1', title: 'Newborn Session', description: 'In-studio, props included, 20 edited images.', price: 2800 },
      { id: 's2', title: 'Family Lifestyle', description: 'On-location 1 hour session.', price: 1800 },
      { id: 's3', title: 'Maternity Shoot', description: 'Studio or outdoor, 15 edits.', price: 2200 },
    ],
    reviews: [
      { id: 'r1', author: 'Nokuthula', rating: 5, comment: 'So patient with our little one. Magical photos.', date: '2026-05-10' },
      { id: 'r2', author: 'Candice', rating: 5, comment: 'Captured our family perfectly.', date: '2026-03-19' },
    ],
  },
  {
    id: 'c12', name: 'Limpopo Beats', tagline: 'Live band & traditional music',
    categoryId: 'music-dj', province: 'Limpopo', city: 'Polokwane',
    avatar: 'https://i.pravatar.cc/400?img=53', startingPrice: 6000, likes: 198,
    bio: 'A 5-piece live band blending Afro-soul, jazz and traditional Tsonga rhythms. Weddings and cultural events.',
    services: [
      { id: 's1', title: 'Live Band (3hr)', description: 'Full band with sound for your event.', price: 6000 },
      { id: 's2', title: 'Acoustic Duo', description: 'Intimate acoustic set for ceremonies.', price: 3000 },
      { id: 's3', title: 'Cultural Performance', description: 'Traditional music and dance set.', price: 7500 },
    ],
    reviews: [
      { id: 'r1', author: 'Mahlatse', rating: 5, comment: 'The crowd loved the traditional set!', date: '2026-04-08' },
      { id: 'r2', author: 'Tertia', rating: 4, comment: 'Talented musicians, great atmosphere.', date: '2026-02-25' },
    ],
  },
  {
    id: 'c13', name: 'Dineo Designs', tagline: 'Web & UI/UX design',
    categoryId: 'design', province: 'North West', city: 'Rustenburg',
    avatar: 'https://i.pravatar.cc/400?img=29', startingPrice: 3500, likes: 341,
    bio: 'I design clean, conversion-focused websites and app interfaces for South African startups.',
    services: [
      { id: 's1', title: 'Landing Page Design', description: 'Single responsive page in Figma.', price: 3500 },
      { id: 's2', title: 'Full Website UI', description: 'Up to 6 pages, design system included.', price: 12000 },
      { id: 's3', title: 'App UI Audit', description: 'UX review with actionable report.', price: 2500 },
    ],
    reviews: [
      { id: 'r1', author: 'Kabelo', rating: 5, comment: 'Our conversion rate jumped after the redesign.', date: '2026-03-27' },
      { id: 'r2', author: 'Lisa', rating: 4, comment: 'Beautiful designs, clear process.', date: '2026-01-31' },
    ],
  },
  {
    id: 'c14', name: 'Kalahari Dance Crew', tagline: 'Performance & choreography',
    categoryId: 'dance', province: 'Northern Cape', city: 'Kimberley',
    avatar: 'https://i.pravatar.cc/400?img=58', startingPrice: 2500, likes: 254,
    bio: 'High-energy dance crew for events, music videos and corporate functions. We also offer choreography workshops.',
    services: [
      { id: 's1', title: 'Event Performance', description: '2 routines at your function.', price: 2500 },
      { id: 's2', title: 'Choreography', description: 'Custom routine for your team or video.', price: 4000 },
      { id: 's3', title: 'Dance Workshop', description: '2 hour group workshop.', price: 1800 },
    ],
    reviews: [
      { id: 'r1', author: 'Shaun', rating: 5, comment: 'Brought the house down at our year-end!', date: '2026-04-19' },
      { id: 'r2', author: 'Ontlametse', rating: 4, comment: 'Energetic and professional crew.', date: '2026-02-11' },
    ],
  },
  {
    id: 'c15', name: 'Zanele Beauty Bar', tagline: 'Hair, nails & makeup',
    categoryId: 'makeup', province: 'Free State', city: 'Welkom',
    avatar: 'https://i.pravatar.cc/400?img=32', startingPrice: 600, likes: 312,
    bio: 'Your one-stop glam squad. Mobile hair, nails and makeup for weddings, matric dances and photoshoots.',
    services: [
      { id: 's1', title: 'Glam Combo', description: 'Makeup, hair and nails package.', price: 1500 },
      { id: 's2', title: 'Makeup Only', description: 'Full face with lashes.', price: 600 },
      { id: 's3', title: 'Bridal Party (3)', description: 'Glam for three guests.', price: 3600 },
    ],
    reviews: [
      { id: 'r1', author: 'Mbali', rating: 5, comment: 'Everyone looked stunning for the wedding.', date: '2026-03-16' },
      { id: 'r2', author: 'Charne', rating: 4, comment: 'Lovely team, ran slightly over time.', date: '2026-01-22' },
    ],
  },
];
