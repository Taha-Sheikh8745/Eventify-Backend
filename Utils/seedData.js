import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Category from '../Models/CategorySchema.js';
import Event from '../Models/EventSchema.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {}

dotenv.config({ path: './.env' });

const categories = [
    { categoryName: 'Weddings & Social', showOnHome: true },
    { categoryName: 'Music & Concerts', showOnHome: true },
    { categoryName: 'Tech & Business', showOnHome: true },
    { categoryName: 'Art & Culture', showOnHome: true },
    { categoryName: 'Sports & Fitness', showOnHome: true }
];

const realisticEvents = [
    // Weddings & Social
    {
        title: 'Royal Grand Wedding Gala',
        category: 'Weddings & Social',
        description: 'An enchanting evening of romance and luxury in a grand ballroom decorated with crystal chandeliers, white orchid floral arches, and live violin serenades.',
        date: '2026-09-15',
        location: 'The Plaza Hotel, New York, NY',
        guests: '350+ Guests',
        tag: 'Luxury',
        images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1465495910483-34a1d374bb36?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Sunset Coastal Engagement Soirée',
        category: 'Weddings & Social',
        description: 'A magical seaside engagement party with rose gold floral arrangements, acoustic guitar sessions, gourmet seafood, and oceanfront sunset vistas.',
        date: '2026-10-02',
        location: 'Malibu Oceanfront Estate, CA',
        guests: '120+ Guests',
        tag: 'Exclusive',
        images: [
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Diamond Jubilee Anniversary Ball',
        category: 'Weddings & Social',
        description: 'Celebrating 50 years of timeless love with a high-fashion masquerade ball featuring champagne towers, live jazz, and bespoke culinary dining.',
        date: '2026-11-20',
        location: 'The Ritz-Carlton, London, UK',
        guests: '200+ Guests',
        tag: 'Premium',
        images: [
            'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
        ]
    },

    // Music & Concerts
    {
        title: 'Symphony of Lights Music Festival',
        category: 'Music & Concerts',
        description: 'A spectacular outdoor festival bringing together world-class electronic artists, symphonic orchestras, state-of-the-art laser shows, and fireworks.',
        date: '2026-09-28',
        location: 'Red Rocks Amphitheatre, CO',
        guests: '15,000+ Guests',
        tag: 'Festival',
        images: [
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Candlelight Jazz & Vintage Wine Night',
        category: 'Music & Concerts',
        description: 'An intimate evening featuring Grammy-winning jazz virtuosos, candlelit tables, artisanal wine pairings, and soul-stirring live melodies.',
        date: '2026-10-18',
        location: 'Napa Valley Vineyard, CA',
        guests: '180+ Guests',
        tag: 'VIP',
        images: [
            'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Neon Horizons Electronic Rave',
        category: 'Music & Concerts',
        description: 'Immerse yourself in futuristic beats, soundwaves, 3D visual projection mapping, and energy powered by world-renowned international DJs.',
        date: '2026-12-05',
        location: 'Miami Beach Arena, FL',
        guests: '8,000+ Guests',
        tag: 'Trending',
        images: [
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
        ]
    },

    // Tech & Business
    {
        title: 'AI & NextGen Future Tech Summit',
        category: 'Tech & Business',
        description: 'Global industry leaders, artificial intelligence pioneers, and venture capitalists gather to reveal groundbreaking innovations and future tech paradigms.',
        date: '2026-10-12',
        location: 'Silicon Valley Center, San Jose, CA',
        guests: '2,500+ Guests',
        tag: 'Conference',
        images: [
            'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Global Founders & Executive Gala',
        category: 'Tech & Business',
        description: 'An elite networking gala featuring keynote speeches from Fortune 500 CEOs, private investment pitch sessions, and a five-star dinner banquet.',
        date: '2026-11-08',
        location: 'Burj Khalifa Ballroom, Dubai, UAE',
        guests: '500+ Guests',
        tag: 'Executive',
        images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'
        ]
    },

    // Art & Culture
    {
        title: 'Haute Couture International Fashion Gala',
        category: 'Art & Culture',
        description: 'A glamorous runway presentation of avant-garde high fashion, designer collections, celebrity red-carpet entrances, and after-party lounge.',
        date: '2026-09-22',
        location: 'Metropolitan Art Pavilion, New York, NY',
        guests: '1,200+ Guests',
        tag: 'Fashion',
        images: [
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518998053574-53ee75de7a93?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Renaissance Culinary & Fine Art Expo',
        category: 'Art & Culture',
        description: 'Immerse your senses in masterwork oil paintings, live glassblowing demonstrations, and gourmet tastings created by Michelin-starred culinary artists.',
        date: '2026-10-30',
        location: 'Louvre Gallery Courtyard, Paris, FR',
        guests: '800+ Guests',
        tag: 'Cultural',
        images: [
            'https://images.unsplash.com/photo-1508191702642-07c728b4998c?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?q=80&w=1200&auto=format&fit=crop'
        ]
    },

    // Sports & Fitness
    {
        title: 'Ultimate Champions Polo & Luxury Cup',
        category: 'Sports & Fitness',
        description: 'Experience the sport of kings with equestrian polo matches, champagne pavilions, VIP lounge seating, and high-society networking.',
        date: '2026-09-18',
        location: 'St. Moritz Polo Club, Switzerland',
        guests: '600+ Guests',
        tag: 'Sports',
        images: [
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        title: 'Sunrise Coastal Yoga & Wellness Retreat',
        category: 'Sports & Fitness',
        description: 'Rejuvenate mind and body with world master yoga instructors, sound healing baths, organic superfood dining, and oceanfront meditation sessions.',
        date: '2026-11-12',
        location: 'Uluwatu Sanctuary, Bali, Indonesia',
        guests: '150+ Guests',
        tag: 'Wellness',
        images: [
            'https://images.unsplash.com/photo-1530549387633-f71af9941f17?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1200&auto=format&fit=crop'
        ]
    }
];

const seed = async () => {
    try {
        const DB = process.env.DATABASE;
        if (!DB) throw new Error('DATABASE URI is missing in .env');

        console.log('Connecting to MongoDB...');
        await mongoose.connect(DB);
        console.log('Connected!');

        // 1. Seed Categories
        console.log('Seeding Categories...');
        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { categoryName: cat.categoryName },
                cat,
                { upsert: true, returnDocument: 'after' }
            );
        }
        console.log('Categories seeded successfully!');

        // 2. Seed Realistic Events
        console.log('Seeding Realistic Events...');
        for (const event of realisticEvents) {
            await Event.findOneAndUpdate(
                { title: event.title, category: event.category },
                event,
                { upsert: true, returnDocument: 'after' }
            );
        }
        console.log('Events seeded successfully!');

        console.log('Data Seeding Completed Successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seed();
