import React, { useState, useEffect, useMemo } from 'react';

import { X, MapPin, TreePine, Sparkles, Leaf, Heart, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import '../styles/mbg-aesthetics.css';
import '../styles/samadhi-sections.css';
import '../styles/samadhi-service-pages.css';
import RetreatPackageCarousel from '../components/retreat/RetreatPackageCarousel';
import { HEALING_ARTS_CONTENT } from '../data/healingArtsContent';
import { motion, AnimatePresence } from 'framer-motion';

// MediaPopup component
const MediaPopup: React.FC<{ onClose: () => void; pauseSlideshow: () => void }> = ({ onClose, pauseSlideshow }) => {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  useEffect(() => {
    pauseSlideshow();
  }, [pauseSlideshow]);

  const images = [
    { src: "/images - Copy/Phone/IMG-20250629-WA0002.webp", desc: "Dr Caves Beach - Dining " },
    { src: "/images - Copy/Phone/IMG_20250614_161408170.webp", desc: "Dr Caves Beach - Montego Bay" },
    { src: "/images - Copy/Phone/IMG_20250619_144254560_HDR.webp", desc: "Worthy Park, Estate Tour" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0001.webp", desc: "Strawberry Hills View" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0005.webp", desc: "Leaving Bath Fountain" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0016 (1).webp", desc: "Bath Fountain" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0046.webp", desc: "Evening Reflections" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0045.webp", desc: "Strawberry Hills - Blue Mountains View" },
    { src: "/images - Copy/Phone/IMG-20250629-WA0060.webp", desc: "Bob Marley Records - Steve Blackwell Studio" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-600 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {images.map(img => (
              <div key={img.src} className="group relative overflow-hidden rounded-xl cursor-pointer" onClick={() => setEnlarged(img.src)}>
                <img 
                  src={img.src} 
                  alt={img.desc} 
                  className="w-full aspect-[4/3] object-cover border-3 border-green-400 rounded-xl shadow-xl transition-transform duration-200 group-hover:scale-105" 
                  style={{ 
                    filter: 'contrast(1.10) saturate(1.12) brightness(0.92) drop-shadow(0 0 8px #fff8) drop-shadow(0 0 2px #2228)',
                    imageRendering: 'auto',
                    transition: 'filter 0.3s, box-shadow 0.3s',
                    boxShadow: '0 0 0.5rem #fff4, 0 2px 16px #2226'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-lg font-semibold mbg-hero-overlay-text" style={{textShadow:'0 2px 12px #000', letterSpacing:'0.01em'}}>
                  {img.desc}
                </div>
              </div>
            ))}
          </div>
          {/* Videos Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
              </svg>
              Video Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h5 className="text-white font-medium mb-3">Worthy Park Estate</h5>
                <div className="w-full aspect-video rounded-lg shadow-md overflow-hidden flex items-center justify-center bg-black">
                  <iframe
                    src="https://drive.google.com/file/d/1P_hyAhwg1FKH5bYAzTUaBlc_ddTgbxgo/preview"
                    allow="autoplay"
                    width="100%"
                    height="360"
                    style={{ border: 'none', borderRadius: '0.75rem', width: '100%', height: '100%' }}
                    title="Worthy Park Estate Video"
                  />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h5 className="text-white font-medium mb-3">Strawberry Hills</h5>
                <div className="w-full aspect-video rounded-lg shadow-md overflow-hidden flex items-center justify-center bg-black">
                  <iframe
                    src="https://drive.google.com/file/d/1azgXyQ9eN4RQmwwXA93odvsTixTzg-iO/preview"
                    allow="autoplay"
                    width="100%"
                    height="360"
                    style={{ border: 'none', borderRadius: '0.75rem', width: '100%', height: '100%' }}
                    title="Strawberry Hills Retreat Experience Video"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Testimonial Quote */}
          <div className="mt-8 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-green-400 bg-gray-800">
                <img 
                  src="/images/Cell Phone/Picsart_25-06-23_02-22-07-116.webp" 
                  alt="DH profile"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">DH</div>
                      `;
                    }
                  }}
                />
              </div>
              <div>
                <h5 className="text-white font-semibold mb-2">DH - 2025</h5>
                <blockquote className="text-green-100 italic text-lg leading-relaxed">
                  "It was fantastic! It was everything I was hoping for and more."
                </blockquote>
                <p className="text-green-200 text-sm mt-2 font-semibold">
                  US Phone: 1-510-841-1800 <span className="font-normal">(call to inquire about Retreat experience & Tour)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {enlarged && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm" onClick={() => setEnlarged(null)}>
          <img 
            src={enlarged} 
            alt="Enlarged" 
            className="max-w-4xl max-h-[90vh] rounded-2xl border-4 border-green-400 shadow-2xl transition-all duration-300" 
            style={{
              objectFit: 'contain',
              background: '#222',
              filter: 'contrast(1.10) saturate(1.12) brightness(0.92) drop-shadow(0 0 8px #fff8) drop-shadow(0 0 2px #2228)',
              imageRendering: 'auto',
              transition: 'filter 0.3s, box-shadow 0.3s',
              boxShadow: '0 0 0.5rem #fff4, 0 2px 16px #2226'
            }}
          />
          <button className="absolute top-8 right-8 text-white text-3xl bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 transition" onClick={e => {e.stopPropagation();setEnlarged(null);}}>&times;</button>
        </div>
      )}
    </div>
  );
};

// Retreat Options for tours
const RETREAT_OPTIONS = [
  // Healing & Wellness
  { id: 'sound-healing', label: 'Sound Healing', group: 'Healing & Wellness' },
  { id: 'guided-meditation', label: 'Guided Meditation', group: 'Healing & Wellness' },
  { id: 'massage-therapy', label: 'Massage Therapy', group: 'Healing & Wellness' },
  { id: 'energy-healing', label: 'Energy Healing', group: 'Healing & Wellness' },
  { id: 'jamaican-meditation', label: 'Jamaican Meditation', group: 'Healing & Wellness' },
  { id: 'pranayama', label: 'Pranayama (Breathwork)', group: 'Healing & Wellness' },
  { id: 'art-therapy', label: 'Art Therapy', group: 'Healing & Wellness' },
  { id: 'herbal-tea-ceremony', label: 'Herbal Tea Ceremony', group: 'Healing & Wellness' },

  // Premium Option
  { id: 'private-island-day', label: 'Private Island Day Retreat (All-Inclusive)', group: 'Premium Experience' },

  // Nature & Adventure
  { id: 'forest-bathing', label: 'Forest Bathing', group: 'Nature & Adventure' },
  { id: 'beach-visit', label: 'Beach Visit', group: 'Nature & Adventure' },
  { id: 'mineral-hot-spring', label: 'Mineral Hot Spring', group: 'Nature & Adventure' },
  { id: 'spa', label: 'Spa', group: 'Nature & Adventure' },
  { id: 'cave-adventure', label: 'Cave Adventure', group: 'Nature & Adventure' },
  { id: 'farm-visit', label: 'Farm Visit', group: 'Nature & Adventure' },
  { id: 'cooking-class', label: 'Cooking Class', group: 'Nature & Adventure' },
  { id: 'nature-photography', label: 'Nature Photography', group: 'Nature & Adventure' },
  { id: 'local-culture-tour', label: 'Local Culture Tour', group: 'Nature & Adventure' },
];

// Workshop features
interface WorkshopFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'traditional' | 'herbalism' | 'spiritual' | 'healing' | 'practical' | 'business' | 'nature';
  icon: React.ReactNode;
}

const workshopFeatures: WorkshopFeature[] = [
  // Nature & Adventure
  { id: 'forest-bathing', name: 'Forest Bathing', description: 'Immerse yourself in the healing power of an amazing local pool and natural spring.', price: 200, category: 'nature', icon: <TreePine className='w-5 h-5' /> },
  { id: 'beach-visit', name: 'Beach Visit', description: 'Relax and rejuvenate with a mindful visit to Jamaica’s pristine beaches.', price: 200, category: 'nature', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'mineral-hot-spring', name: 'Mineral Hot Spring', description: 'Experience the therapeutic benefits of Jamaica’s natural hot springs.', price: 250, category: 'nature', icon: <Leaf className='w-5 h-5' /> },
  { id: 'spa', name: 'Spa', description: 'Enjoy a memorable spa experience with holistic treatments.', price: 200, category: 'nature', icon: <Heart className='w-5 h-5' /> },
  { id: 'cave-adventure', name: 'Cave Adventure', description: 'Explore Jamaica’s mystical caves and connect with the earth’s energy.', price: 200, category: 'nature', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'farm-visit', name: 'Farm Visit', description: 'Discover sustainable farming and local agriculture on a guided farm tour at our tribal estates.', price: 200, category: 'nature', icon: <Leaf className='w-5 h-5' /> },
  { id: 'strawberry-hills', name: 'Strawberry Hills', description: 'An ascent into the Blue Mountains, where we dine with the clouds.', price: 200, category: 'nature', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'local-culture-tour', name: 'Local Culture Tour', description: 'Experience Jamaica’s vibrant culture and history on a guided tour off the beaten path.', price: 250, category: 'nature', icon: <MapPin className='w-5 h-5' /> },

  // Traditional Indigenous Wisdom
  { id: 'rastafari-philosophy', name: 'Rastafari Philosophy & Culture', description: 'Deep dive into Rastafari principles, history, and spiritual practices', price: 299, category: 'traditional', icon: <Heart className='w-5 h-5' /> },
  { id: 'drumming-chanting', name: 'Traditional Drumming & Chant', description: 'Learn sacred rhythms and spiritual chants from Jamaican tradition', price: 165, category: 'traditional', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'cultural-storytelling', name: 'Cultural Storytelling & Folklore', description: 'Explore Jamaica\'s rich oral traditions and ancestral wisdom', price: 162, category: 'traditional', icon: <Book className='w-5 h-5' /> },
  { id: 'traditional-dance', name: 'Sacred Movement & Dance', description: 'Traditional Jamaican spiritual dance and movement practices', price: 99, category: 'traditional', icon: <Heart className='w-5 h-5' /> },
  { id: 'nyahbinghi-drumming', name: 'Nyahbinghi Drumming Lesson', description: 'Learn the sacred Nyahbinghi rhythm and origins', price: 299, category: 'traditional', icon: <Sparkles className='w-5 h-5' /> },
  
  // Herbalism & Plant Medicine
  { id: 'bush-medicine', name: 'Jamaican Bush Medicine', description: 'Learn traditional herbal tea medicine preparation', price: 63, category: 'herbalism', icon: <Leaf className='w-5 h-5' /> },
  { id: 'herb-identification', name: 'Medicinal Plant Identification', description: 'Field guide to identifying and harvesting local medicinal plants', price: 99, category: 'herbalism', icon: <TreePine className='w-5 h-5' /> },
  { id: 'botanical-formulations', name: 'Botanical Formulations', description: 'Learn Dr. Feqad\'s signature tincture formulation method', price: 299, category: 'herbalism', icon: <Sparkles className='w-5 h-5' /> },
  
  // Spiritual Practices
  { id: 'spiritual-cleansing', name: 'Spiritual Cleansing Rituals', description: 'Learn traditional purification and protection ceremonies', price: 99, category: 'spiritual', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'ancestral-connection', name: 'Ancestral Connection Workshop', description: 'Techniques for connecting with ancestral wisdom and guidance', price: 99, category: 'spiritual', icon: <Heart className='w-5 h-5' /> },
  
  // Healing Arts
  { id: 'sound-healing', name: 'Sound Healing', description: 'Experience vibrational healing through sound baths and therapeutic frequencies.', price: 108, category: 'healing', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'guided-meditation', name: 'Guided Meditation', description: 'Participate in deeply relaxing guided meditation sessions for inner peace.', price: 99, category: 'healing', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'massage-therapy', name: 'Massage Therapy', description: 'Enjoy restorative massage therapy for relaxation and holistic wellness.', price: 117, category: 'healing', icon: <Heart className='w-5 h-5' /> },
  { id: 'energy-healing', name: 'Energy Healing', description: 'Receive energy healing sessions to balance and rejuvenate your mind and body.', price: 108, category: 'healing', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'pranayama', name: 'Pranayama (Breathwork)', description: 'Learn breathwork practices to enhance vitality and reduce stress.', price: 54, category: 'healing', icon: <Leaf className='w-5 h-5' /> },
  { id: 'art-therapy', name: 'Art Therapy', description: 'Express yourself and heal through creative art therapy sessions.', price: 63, category: 'healing', icon: <Book className='w-5 h-5' /> },  
  
  // Business Workshops
  { id: 'strategic-planning', name: 'Strategic Planning', description: 'Empower your team with proven strategies for business growth, leadership, and project management.', price: 299, category: 'business', icon: <Sparkles className='w-5 h-5' /> },
  { id: 'marketing-branding', name: 'Marketing & Branding', description: 'Learn modern marketing, branding, and digital presence techniques to elevate your business.', price: 299, category: 'business', icon: <Book className='w-5 h-5' /> },
];

const vehicleTypes = [
  { id: 'sedan', name: 'Sedan (Toyota Axio, Nissan AD, Honda Fit, etc.)', capacity: 3 },
  { id: 'minivan', name: 'Minivan (Toyota Noah, Nissan Serena, Toyota Voxy, etc.)', capacity: 6 },
  { id: 'jeep', name: '4x4 Jeep (Suzuki Vitara, Toyota Prado, Land Cruiser, etc.)', capacity: 4 },
  { id: 'pickup', name: 'Pickup Truck (Toyota Hilux, Isuzu D-Max, etc.)', capacity: 4 },
];

const accommodationTypes = [
  { id: 'guesthouse', name: 'Guesthouse' },
  { id: 'villa', name: 'Villa' },
  { id: 'hotel', name: 'Hotel' },
  { id: 'eco-lodge', name: 'Eco-Lodge' },
  { id: 'boutique', name: 'Boutique Hotel' },
];

const testimonials = [
  {
    id: 0,
    name: "DH",
    service: "Custom Healing Retreat",
    details: "Premium Retreat Experience",
    location: "2025",
    quote: "It was fantastic! It was everything I was hoping for and more.",
    initial: "DH",
    image: "/images/Cell Phone/Picsart_25-06-23_02-22-07-116.webp",
    hasMediaPopup: true,
    phone: "1-510-841-1800"
  },
  {
    id: 1,
    name: "Hildegard",
    service: "Reiki Sound Bath & Retreat Experience",
    details: "Wellness Retreat Participant",
    location: "August 2022",
    quote: "They welcomed us with such kind hospitality and made us feel like friends of the family. The Reiki Sound Bath was an extremely great and unique experience. They are also great vegan cooks and we were lucky to try one of their delicious dishes.",
    initial: "H",
    image: "/images/testimonials/hildegard-avatar.webp"
  },
  {
    id: 2,
    name: "Hugo L",
    service: "Vegan Culinary Experience",
    details: "5-Star Review",
    location: "January 2020",
    quote: "It was so pleasing. They present a very tasty vegan repertoire of dishes. Also they're incredibly warm hearted and seeking for a great interaction. All of that is reflected on their incredibly organic tasty food!",
    initial: "HL",
    image: "/images/testimonials/hugo-avatar.webp"
  },
  {
    id: 3,
    name: "Carol",
    service: "Retreat Experience",
    details: "Mindful Elevation Journey",
    location: "September 2022",
    quote: "Such beautiful souls...adding radiant glory to our universe. This visit will ensure you grounding in a true loving environment. So proud to be a part of experiencing mindful and conscious elevation. It's a true gift when others are able to love, give and share so effortlessly - while you are being displaced from your own comforts. Try their tea - The Best!!! A+++++",
    initial: "C",
    image: "/images/testimonials/carol-avatar.webp"
  },
  {
    id: 4,
    name: "Julia",
    service: "4-Day Retreat & Sound Bath",
    details: "Mother-Daughter Retreat",
    location: "September 2022",
    quote: "My daughter and I stayed for a 4 day retreat and loved our hosts, beautiful people! The Sound Bath experience was very relaxing. Plenty of space to relax in and comfortable bed.",
    initial: "J",
    image: "/images/testimonials/julia-avatar.webp"
  }
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
}

const ExperiencesPage: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0].id);
  const [selectedAccommodation, setSelectedAccommodation] = useState(accommodationTypes[0].id);
  const [numParticipants, setNumParticipants] = useState(2);
  const [retreatSummaryExpanded, setRetreatSummaryExpanded] = useState(false);
  const [selectedDestinations, _setSelectedDestinations] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedRetreatOptions, setSelectedRetreatOptions] = useState<string[]>([]);
  const [_inquiryComplete, _setInquiryComplete] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [workshopDetails, setWorkshopDetails] = useState({
    dates: [''],
    participants: 1,
    location: '',
    specialRequests: ''
  });
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const isMobile = useIsMobile();

  // Testimonial slideshow
  useEffect(() => {
    if (!isSlideShowPaused) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isSlideShowPaused]);

  const _handleRetreatOptionToggle = (optionId: string) => {
    setSelectedRetreatOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) => {
      let next;
      if (prev.includes(featureId)) {
        next = prev.filter((id) => id !== featureId);
      } else {
        next = [...prev, featureId];
      }
      const numDates = Math.ceil(next.length / 2) || 1;
      setWorkshopDetails((details) => ({
        ...details,
        dates: Array(numDates).fill('').map((_, i) => details.dates[i] || '')
      }));
      return next;
    });
  };

  const _handleRequestTourInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const activities = RETREAT_OPTIONS.filter(opt => selectedRetreatOptions.includes(opt.id)).map(opt => opt.label);
    const destinations = selectedDestinations.length > 0 ? selectedDestinations : [preferredLocation || 'Jamaica'];
    const formData = {
      startDate,
      endDate,
      numParticipants,
      preferredLocation,
      destinations,
      accommodation: selectedAccommodation ? accommodationTypes.find(a => a.id === selectedAccommodation)?.name : 'N/A',
      vehicle: selectedVehicle ? vehicleTypes.find(v => v.id === selectedVehicle)?.name : 'N/A',
      specialRequests,
      retreatOptions: activities,
      contactInfo
    };
  _setInquiryComplete(true);
    // Send inquiry emails
    try {
      await fetch('/api/retreat-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.error('Error sending inquiry:', err);
    }
  };

  const numDays = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(6, diff > 0 ? diff : 0);
    }
    return 6;
  }, [startDate, endDate]);

  const calculateDays = () => Math.ceil(selectedFeatures.length / 2) || 1;

  const calculateCoordinationFee = () => {
    const days = calculateDays();
    return 180 * days;
  };

  const calculateTotalPrice = () => {
    const coordinationFee = calculateCoordinationFee();
    const featuresTotal = selectedFeatures.reduce((total, featureId) => {
      const feature = workshopFeatures.find(f => f.id === featureId);
      return total + (feature ? feature.price : 0);
    }, 0);
    return coordinationFee + featuresTotal;
  };

  const _handleBookWorkshop = () => {
    const missingFields = [];
    if (!contactInfo.name.trim()) missingFields.push('Full Name');
    if (!contactInfo.email.trim()) missingFields.push('Email Address');
    for (let i = 0; i < Math.ceil(selectedFeatures.length / 2); i++) {
      if (!workshopDetails.dates[i]) missingFields.push(`Workshop Date ${i + 1}`);
    }
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const assignments: { date: string, workshops: string[] }[] = [];
    for (let i = 0; i < Math.ceil(selectedFeatures.length / 2); i++) {
      assignments.push({
        date: workshopDetails.dates[i],
        workshops: selectedFeatures.slice(i * 2, i * 2 + 2)
      });
    }

    const detailedNotes = assignments.map((a, i) => {
      const names = a.workshops.map(id => workshopFeatures.find(f => f.id === id)?.name).filter(Boolean).join(', ');
      return `Day ${i+1} (${a.date}): ${names}`;
    }).join('\n');

    const notes = `Community Workshop Experience for ${workshopDetails.participants} participant(s).\n\n` +
      detailedNotes +
      `\n\nLocation Preference: ${workshopDetails.location || 'Community center'}\nSpecial Requests: ${workshopDetails.specialRequests || 'None'}\n`;

    const params = new URLSearchParams({
      serviceId: 'community-workshop',
      serviceName: 'Community Workshop Experience',
      servicePrice: String(calculateTotalPrice()),
      serviceDuration: `${assignments.length} day(s)`,
      practitionerName: "Feq'ad Wolde & Community Teachers",
      date: assignments.map(a => a.date).join(', '),
      time: 'Workshop starts at 10:00 AM',
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      notes
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleBookRetreat = () => {
    // Validate required Retreat Details
    const missingFields = [];
    if (!contactInfo.name.trim()) missingFields.push('Full Name');
    if (!contactInfo.email.trim()) missingFields.push('Email Address');
    if (!startDate) missingFields.push('Start Date');
    if (!endDate) missingFields.push('End Date');
    if (!numParticipants || numParticipants < 1) missingFields.push('Number of Participants');
    if (!selectedAccommodation) missingFields.push('Accommodation Type');
    if (!selectedVehicle) missingFields.push('Preferred Rental Vehicle');
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    // Gather all retreat details for payment
    const params = new URLSearchParams({
      serviceId: 'retreat-tour',
      serviceName: 'Jamaica Retreat Tour',
      servicePrice: String(totalPrice),
      serviceDuration: `${numDays} day(s)`,
      practitionerName: "Feq'ad Wolde & Team",
      date: startDate && endDate ? `${startDate} to ${endDate}` : '',
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      notes: [
        `Participants: ${numParticipants}`,
        `Preferred Location: ${preferredLocation}`,
        `Accommodation: ${selectedAccommodation ? accommodationTypes.find(a => a.id === selectedAccommodation)?.name : 'N/A'}`,
        `Vehicle: ${selectedVehicle ? vehicleTypes.find(v => v.id === selectedVehicle)?.name : 'N/A'}`,
        `Special Requests: ${specialRequests}`
      ].join('\n')
    });
    navigate(`/booking?${params.toString()}`);
  };

  const groupedFeatures = useMemo(() => workshopFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, WorkshopFeature[]>), []);

  const categoryNames = {
    traditional: 'Indigenous Jamaican Wisdom',
    herbalism: 'Botanical Remedies',
    spiritual: 'Spiritual Practices',
    healing: HEALING_ARTS_CONTENT.title,
    nature: 'Nature & Adventure',
    business: 'Business Workshops'
  };

  const basePricePerDay = 180;
  const retreatDays = numDays;

  const allSelectedActivities = useMemo(() => [...new Set([...selectedFeatures, ...selectedRetreatOptions])], [selectedFeatures, selectedRetreatOptions]);
  const maxActivities = numDays * 2;
  const limitedSelectedActivities = allSelectedActivities.slice(0, maxActivities);

  const activityTotal = useMemo(() => limitedSelectedActivities.reduce((activitySum, activityId) => {
    const activityFeature = workshopFeatures.find(f => f.id === activityId);
    if (!activityFeature) return activitySum;
    let price = activityFeature.price;
    const extra = Math.max(0, numParticipants - (activityFeature.category === 'business' || activityFeature.category === 'healing' ? 1 : 2));
    if (activityFeature.category === 'traditional' || activityFeature.category === 'spiritual' || activityFeature.category === 'herbalism') {
      price = (activityFeature.category === 'traditional' || activityFeature.category === 'spiritual' ? 99 : price) + extra * 9;
    } else if (activityFeature.category === 'business') {
      price += extra * 15;
    } else if (activityFeature.category === 'nature') {
      price += extra * 25;
    } else if (activityFeature.category === 'healing') {
      if (activityFeature.id === 'pranayama') {
        price += extra * 15;
      } else if (activityFeature.id === 'art-therapy') {
        price += extra * 25;
      } else {
        price += extra * 50;
      }
    }
    return activitySum + price;
  }, 0), [limitedSelectedActivities, numParticipants]);

  const chauffeurFee = 500;
  const chefFee = 500;
  const vehiclePrices: Record<string, number> = {
    sedan: 89,
    minivan: 100,
    jeep: 120,
    pickup: 110
  };
  const selectedVehiclePrice = vehiclePrices[selectedVehicle] || 89;
  const vehicleFee = selectedVehiclePrice * retreatDays;
  const totalPrice = basePricePerDay * retreatDays + chauffeurFee + chefFee + vehicleFee + activityTotal;

  return (
    <>
      <SEO
        title={PAGE_SEO["/experiences"].title}
        description={PAGE_SEO["/experiences"].description}
        image={PAGE_SEO["/experiences"].image}
        imageAlt={PAGE_SEO["/experiences"].imageAlt}
        imageWidth={1200}
        imageHeight={630}
        url="/experiences"
        schemaType="Service"
        locale="en_US"
        siteName="Portals of Samadhi"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: 'Jamaica Retreat Tours & Healing Adventures',
          description: 'Authentic Jamaican retreat tours combining traditional healing, cultural immersion, and natural beauty for international wellness seekers.',
          provider: {
            '@type': 'Organization',
            name: 'Portals of Samadhi',
            description: 'Authentic Jamaican healing and wellness experiences for global travelers.'
          },
          touristType: [
            'Wellness Seekers',
            'Spiritual Travelers', 
            'Cultural Enthusiasts',
            'Healing Practitioners',
            'International Visitors'
          ],
          itinerary: [
            {
              '@type': 'TouristDestination',
              name: 'Traditional Healing Experiences',
              description: 'Authentic Jamaican indigenous healing practices and energy work sessions'
            },
            {
              '@type': 'TouristDestination', 
              name: 'Cultural Immersion Activities',
              description: 'Deep dive into authentic Jamaican culture, traditions, and local wisdom'
            },
            {
              '@type': 'TouristDestination',
              name: 'Natural Beauty Adventures', 
              description: 'Explore Jamaica stunning landscapes, beaches, and natural healing environments'
            }
          ],
          offers: [
            {
              '@type': 'Offer',
              name: 'Cultural Immersion Retreat',
              description: 'Deep cultural experience with traditional healing and authentic Jamaican lifestyle'
            },
            {
              '@type': 'Offer',
              name: 'Healing Adventure Package',
              description: 'Intensive healing sessions combined with cultural exploration and natural adventures'
            },
            {
              '@type': 'Offer',
              name: 'Spiritual Transformation Journey',
              description: 'Complete spiritual and cultural transformation experience in authentic Jamaican setting'
            }
          ],
          audience: 'International wellness seekers, spiritual travelers, healing practitioners, and cultural enthusiasts seeking authentic Jamaican experiences.',
          locationCreated: {
            '@type': 'Place',
            name: 'Jamaica',
            description: 'Authentic experiences throughout beautiful Jamaica'
          }
        }}
      />
      
      <div
        className="samadhi-retreat-page min-h-screen relative w-full"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.92) 55%, rgba(0,0,0,0.96) 100%), url('/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hero Section */}
        <div className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-0 sm:px-2 md:px-4 pt-4 pb-20" style={{maxWidth: 'none', width: '100vw', margin: '0', marginTop: '0'}}>
          <div className="flex-shrink-0 flex justify-center items-center mb-8 md:mb-0 md:mr-12">
            <img
              src="/images - Copy/Phone/IMG_20250619_144257012_HDR.webp"
              alt="Welcome Image"
              className="samadhi-retreat-hero__image rounded-full shadow-2xl border-4 object-cover"
              style={{ width: '320px', height: '320px', aspectRatio: '1/1' }}
            />
          </div>
          <div className="w-full md:max-w-2xl text-center md:text-left mobile-max-w-full" style={{maxWidth: 'none !important', width: '100% !important'}}>
            <h1 className="samadhi-retreat-hero__title">
              Retreat Tours
            </h1>
            <div className="samadhi-retreat-hero__copy">
              <p>
                Step into Jamaica as family, not a tourist. Our retreat tours and private
                workshops carry you to working farms, sacred sites, ital kitchens, and hidden
                landscapes guided by Feq&apos;ad&apos;s roots, Maroon wisdom, and the warmth
                of island hospitality.
              </p>
              <Button
                className="samadhi-retreat-btn samadhi-retreat-btn--glass"
                onClick={() => setShowProcessModal(true)}
              >
                Our Process
              </Button>
            </div>
            {/* Process Modal */}
            {showProcessModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
                onClick={() => setShowProcessModal(false)}
              >
                <div
                  className="samadhi-retreat-modal samadhi-retreat-modal--wide"
                  style={{ margin: '2rem', maxHeight: 'calc(100vh - 4rem)' }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="samadhi-retreat-modal__close"
                    onClick={() => setShowProcessModal(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="samadhi-retreat-modal__title text-center">How Your Retreat Unfolds</h3>
                  <div className="samadhi-retreat-modal__body">
                    <p className="samadhi-retreat-process__note">
                      No activities are scheduled on the first and last day of your visit. These days are not counted as retreat days.
                    </p>
                    <ol className="samadhi-retreat-process__list">
                      <li>
                        <span className="font-bold">Destination Selection</span><br />
                        Complete the form with your ideal location, and we’ll identify the best accommodation for your budget. You choose your preferred location in Jamaica, and we’ll arrange genuine accommodations where we’ll stay alongside you, creating a true family atmosphere.
                      </li>
                      <li>
                        <span className="font-bold">Curated Activities</span><br />
                        Review our list of healing experiences, or let us organically design your journey based on real local opportunities during your stay.
                      </li>
                      <li>
                        <span className="font-bold">Transportation & Guidance</span><br />
                        Arrange a rental vehicle for the group, and Dr. Feq’ad will serve as your dedicated driver and cultural guide throughout the experience.
                      </li>
                      <li>
                        <span className="font-bold">Culinary Excellence</span><br />
                        Shop with us for natural local ingredients and enjoy our Jamaican-American-Ethiopian fusion cuisine. Join us in the kitchen for lessons or simply savor the final product. We’ll show you how to get the best value while eating the highest-quality health food.
                      </li>
                      <li>
                        <span className="font-bold">Spiritual Practices</span><br />
                        Refine your healing arts in a natural setting, or be guided through meditation, yoga, and healing sessions in sacred environments that enhance spiritual growth and inner peace.
                      </li>
                      <li>
                        <span className="font-bold">Hidden Treasures</span><br />
                        We’ll take you to breathtaking off-the-beaten-path locations, sharing profound cultural encounters only accessible through our deep local knowledge.
                      </li>
                      <li>
                        <span className="font-bold">Transformation Complete</span><br />
                        Return home with profound healing, expanded consciousness, and lasting memories of an authentic Jamaican spiritual journey with our family.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Service Packages Carousel */}
        <RetreatPackageCarousel
          selectedIds={selectedFeatures}
          onSelectPackage={(pkg) => {
            handleFeatureToggle(pkg.id);
            const el = document.getElementById('retreat-form');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Main Content Container */}
        <div id="retreat-form" className="w-full mx-0 px-0 sm:px-2 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 py-8" style={{maxWidth: 'none', scrollMarginTop: '72px'}}>
          {/* Combined Services Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Tour Details Section with Contact Information */}
              <Card className="mbg-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-light mbg-text-primary flex items-center">
                    <MapPin className="w-6 h-6 mr-3 mbg-text-accent" />
                    Retreat Tour Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred Start Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="mbg-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred End Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        min={startDate ? startDate : ''}
                        onChange={e => setEndDate(e.target.value)}
                        className="mbg-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mbg-text-secondary mb-2">Number of Participants</label>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={numParticipants}
                        onChange={e => setNumParticipants(Number(e.target.value) || 1)}
                        className="mbg-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred Location</label>
                      <Input
                        type="text"
                        value={preferredLocation}
                        onChange={e => setPreferredLocation(e.target.value)}
                        className="mbg-input w-full"
                        placeholder="e.g. Blue Mountains, Negril, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mbg-text-secondary mb-2">Accommodation Type</label>
                    <select
                      value={selectedAccommodation}
                      onChange={e => setSelectedAccommodation(e.target.value)}
                      className="mbg-input w-full"
                    >
                      {accommodationTypes.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred Rental Vehicle</label>
                    <select
                      value={selectedVehicle}
                      onChange={e => setSelectedVehicle(e.target.value)}
                      className="mbg-input w-full"
                    >
                      {vehicleTypes.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mbg-text-secondary mb-2">Special Requests</label>
                    <Textarea
                      rows={3}
                      value={specialRequests}
                      onChange={e => setSpecialRequests(e.target.value)}
                      className="mbg-input"
                      placeholder="Let us know about dietary needs, accessibility, or anything else."
                    />
                  </div>

                  {/* Contact Information Section */}
                  <div className="pt-8 border-t border-gray-200">
                    <h2 className="text-xl md:text-2xl font-bold mbg-text-primary mb-4 text-center">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium mbg-text-secondary">Full Name *</Label>
                        <Input
                          id="name"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 mbg-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium mbg-text-secondary">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1 mbg-input"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="phone" className="text-sm font-medium mbg-text-secondary">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 mbg-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nature & Adventure Section - always first */}
              {groupedFeatures.nature && (
                <Card className="mbg-card mt-12">
                  <CardContent>
                    <h2 className="text-xl md:text-2xl font-light mbg-text-primary flex items-center mb-2">
                      <MapPin className="w-6 h-6 mr-3 mbg-text-accent" />
                      Activities
                    </h2>
                    <h2 className="text-xl font-light mbg-text-primary mb-4">Nature & Adventure</h2>
                    {numDays < 6 ? (
                      <p className="text-red-500">Minimum 6 days required for activities.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedFeatures.nature.map((feature) => {
                          const isDisabled = selectedFeatures.length >= maxActivities && !selectedFeatures.includes(feature.id);
                          const extra = Math.max(0, numParticipants - 2);
                          const naturePrice = feature.price + extra * 25;
                          return (
                            <div key={feature.id} className={`mbg-card-small ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Checkbox
                                id={feature.id}
                                checked={selectedFeatures.includes(feature.id)}
                                onCheckedChange={() => !isDisabled && handleFeatureToggle(feature.id)}
                                className="mt-1"
                                disabled={isDisabled}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={feature.id} className="font-medium mbg-text-primary cursor-pointer flex items-center" style={{flex: '1 1 auto', minWidth: 0}}>
                                    {feature.icon}
                                    <span className="ml-2" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{feature.name}</span>
                                  </Label>
                                  <span className="mbg-text-accent font-semibold" style={{marginLeft: '8px'}}>${naturePrice}</span>
                                </div>
                                <p className="text-sm mbg-text-secondary mt-1">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-4 text-xs text-gray-600 font-medium">
                      <strong>Pricing Note:</strong> Price covers gas for the day. May cover certain activities depending on how many activities are chosen.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Workshop Selection - all other categories */}
              {Object.entries(groupedFeatures).filter(([category]) => category !== 'nature').map(([category, features]) => (
                <Card key={category} className="mbg-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-light mbg-text-primary">
                      {category === 'healing'
                        ? HEALING_ARTS_CONTENT.title
                        : categoryNames[category as keyof typeof categoryNames]}
                    </CardTitle>
                    {category === 'healing' && (
                      <p className="samadhi-healing-arts__desc samadhi-healing-arts__desc--card mt-2">
                        {HEALING_ARTS_CONTENT.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {numDays < 6 ? (
                      <p className="text-red-500">Minimum 6 days required for activities.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature) => {
                          const isDisabled = selectedFeatures.length >= maxActivities && !selectedFeatures.includes(feature.id);
                          let price = feature.price;
                          const extra = Math.max(0, numParticipants - (category === 'business' || category === 'healing' ? 1 : 2));
                          if (category === 'traditional' || category === 'spiritual' || category === 'herbalism') {
                            price = (category === 'traditional' || category === 'spiritual' ? 99 : price) + extra * 9;
                          } else if (category === 'business') {
                            price += extra * 15;
                          } else if (category === 'nature') {
                            price += extra * 25;
                          } else if (category === 'healing') {
                            if (feature.id === 'pranayama') {
                              price += extra * 15;
                            } else if (feature.id === 'art-therapy') {
                              price += extra * 25;
                            } else {
                              price += extra * 50;
                            }
                          }
                          return (
                            <div key={feature.id} className={`mbg-card-small ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Checkbox
                                id={feature.id}
                                checked={selectedFeatures.includes(feature.id)}
                                onCheckedChange={() => !isDisabled && handleFeatureToggle(feature.id)}
                                className="mt-1"
                                disabled={isDisabled}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={feature.id} className="font-medium mbg-text-primary cursor-pointer flex items-center" style={{flex: '1 1 auto', minWidth: 0}}>
                                    {feature.icon}
                                    <span className="ml-2" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{feature.name}</span>
                                  </Label>
                                  <span className="mbg-text-accent font-semibold" style={{marginLeft: '8px'}}>${price}</span>
                                </div>
                                <p className="text-sm mbg-text-secondary mt-1">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* Pricing explanation for each category */}
                    {category === 'nature' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Nature & Adventure activities are base price plus $25 for each additional participant beyond 2.
                      </div>
                    )}
                    {category === 'traditional' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Indigenous Jamaican Wisdom activities are $99 for up to 2 participants, plus $9 for each additional participant.
                      </div>
                    )}
                    {category === 'herbalism' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Botanical Remedies activities are base price plus $9 for each additional participant beyond 2.
                      </div>
                    )}
                    {category === 'spiritual' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Spiritual Practices activities are $99 for up to 2 participants, plus $9 for each additional participant.
                      </div>
                    )}
                    {category === 'business' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Business Workshops activities are base price plus $15 for each additional participant beyond 1.
                      </div>
                    )}
                    {category === 'healing' && (
                      <div className="mt-4 text-xs text-gray-600 font-medium">
                        <strong>Pricing Note:</strong> Healing Arts activities have dynamic pricing based on activity and participant count.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Combined Pricing Summary Sidebar */}
            <div className="space-y-6">
              <Card className="mbg-card sticky top-8 hidden sm:block">
                <CardHeader>
                  <CardTitle className="text-2xl font-light mbg-text-primary text-center">
                    Retreat Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Unified Retreat Summary */}
                    {(selectedFeatures.length > 0 || selectedRetreatOptions.length > 0 || startDate || endDate) ? (
                      <div>
                        {startDate && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="mbg-text-secondary">Start Date</span>
                            <span className="font-medium mbg-text-primary">{startDate}</span>
                          </div>
                        )}
                        {endDate && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="mbg-text-secondary">End Date</span>
                            <span className="font-medium mbg-text-primary">{endDate}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="mbg-text-secondary">Participants</span>
                          <span className="font-medium mbg-text-primary">{numParticipants}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="mbg-text-secondary">Duration</span>
                          <span className="font-medium mbg-text-primary">{numDays} days</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="mbg-text-secondary">Base Price</span>
                          <span className="font-medium mbg-text-primary">${basePricePerDay} x {numDays} = ${basePricePerDay * retreatDays}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="mbg-text-secondary">Chauffeur Fee</span>
                          <span className="font-medium mbg-text-primary">${chauffeurFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="mbg-text-secondary">Personal Chef Fee</span>
                          <span className="font-medium mbg-text-primary">${chefFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="mbg-text-secondary">Vehicle Rental Fee</span>
                          <span className="font-medium mbg-text-primary">${selectedVehiclePrice} x {numDays} = ${vehicleFee}</span>
                        </div>
                        {limitedSelectedActivities.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm mbg-text-secondary">Selected Activities ({limitedSelectedActivities.length}):</span>
                            <ul className="text-left mt-1">
                              {limitedSelectedActivities.map(id => {
                                const actFeature = workshopFeatures.find(f => f.id === id);
                                if (!actFeature) return null;
                                let actPrice = actFeature.price;
                                const extra = Math.max(0, numParticipants - (actFeature.category === 'business' || actFeature.category === 'healing' ? 1 : 2));
                                if (actFeature.category === 'traditional' || actFeature.category === 'spiritual' || actFeature.category === 'herbalism') {
                                  actPrice = (actFeature.category === 'traditional' || actFeature.category === 'spiritual' ? 99 : actPrice) + extra * 9;
                                } else if (actFeature.category === 'business') {
                                  actPrice += extra * 15;
                                } else if (actFeature.category === 'nature') {
                                  actPrice += extra * 25;
                                } else if (actFeature.category === 'healing') {
                                  if (actFeature.id === 'pranayama') {
                                    actPrice += extra * 15;
                                  } else if (actFeature.id === 'art-therapy') {
                                    actPrice += extra * 25;
                                  } else {
                                    actPrice += extra * 50;
                                  }
                                }
                                return (
                                  <li key={id} className="flex justify-between"><span>{actFeature.name}</span><span>${actPrice}</span></li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                        <div className="font-bold text-lg mt-3 mbg-text-accent">Total: ${totalPrice}</div>
                        <div className="text-xs text-gray-500 mt-2">* Max 2 activities per day.</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="mbg-text-secondary mb-4 text-center">Select retreat activities to see pricing and options.</p>
                        <div className="space-y-2 text-center">
                          <p className="text-sm mbg-text-accent">• Retreat Tours: Custom family adventures</p>
                        </div>
                      </div>
                    )}

                    {/* Single Book Button */}
                    {(selectedFeatures.length > 0 || selectedRetreatOptions.length > 0 || startDate || endDate) && (
                      <div className="mt-4">
                        <Button 
                          onClick={handleBookRetreat}
                          className="samadhi-retreat-btn w-full py-3 text-lg font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Book
                        </Button>
                        <p className="text-sm mbg-text-secondary text-center mt-2">
                          Secure payment processing • Full refund if cancelled 48hrs before
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile: Floating Retreat Summary bar at bottom */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 w-full z-50" style={{pointerEvents:'none'}}>
            <div
              className="samadhi-retreat-summary-bar mx-auto max-w-md flex items-center justify-center px-3 py-2 rounded-t-xl shadow-2xl border-t-2 cursor-pointer"
              style={{pointerEvents:'auto', minHeight:'52px'}}
              onClick={() => setRetreatSummaryExpanded(exp => !exp)}
            >
              <div className="flex flex-row items-center justify-center w-full gap-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-medium opacity-80">Total</span>
                  <span className="text-lg font-bold">${totalPrice}</span>
                </div>
                <Button
                  onClick={e => { e.stopPropagation(); handleBookRetreat(); }}
                  className="samadhi-retreat-summary-btn font-semibold px-4 py-2 rounded-lg shadow-md text-base transition-all duration-200"
                  style={{minWidth:'120px', fontSize:'1rem'}}>
                  Book
                </Button>
              </div>
            </div>
            {retreatSummaryExpanded && (
              <div className="mx-auto max-w-md bg-white text-green-900 px-4 py-6 rounded-b-xl shadow-2xl border-b-2 border-green-700 samadhi-retreat-summary-expanded"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Duration</span>
                    <span className="font-medium mbg-text-primary">{numDays} day(s)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Participants</span>
                    <span className="font-medium mbg-text-primary">{numParticipants}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Base Price</span>
                    <span className="font-medium mbg-text-primary">${basePricePerDay} x {numDays} = ${basePricePerDay * retreatDays}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Chauffeur Fee</span>
                    <span className="font-medium mbg-text-primary">${chauffeurFee}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Personal Chef Fee</span>
                    <span className="font-medium mbg-text-primary">${chefFee}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Vehicle Rental Fee</span>
                    <span className="font-medium mbg-text-primary">${selectedVehiclePrice} x {numDays} = ${vehicleFee}</span>
                  </div>
                  {limitedSelectedActivities.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm mbg-text-secondary">Selected Activities ({limitedSelectedActivities.length}):</span>
                      <ul className="text-left mt-1">
                        {limitedSelectedActivities.map(id => {
                          const actFeature = workshopFeatures.find(f => f.id === id);
                          if (!actFeature) return null;
                          let actPrice = actFeature.price;
                          const extra = Math.max(0, numParticipants - (actFeature.category === 'business' || actFeature.category === 'healing' ? 1 : 2));
                          if (actFeature.category === 'traditional' || actFeature.category === 'spiritual' || actFeature.category === 'herbalism') {
                            actPrice = (actFeature.category === 'traditional' || actFeature.category === 'spiritual' ? 99 : actPrice) + extra * 9;
                          } else if (actFeature.category === 'business') {
                            actPrice += extra * 15;
                          } else if (actFeature.category === 'nature') {
                            actPrice += extra * 25;
                          } else if (actFeature.category === 'healing') {
                            if (actFeature.id === 'pranayama') {
                              actPrice += extra * 15;
                            } else if (actFeature.id === 'art-therapy') {
                              actPrice += extra * 25;
                            } else {
                              actPrice += extra * 50;
                            }
                          }
                          return (
                            <li key={id} className="flex justify-between"><span>{actFeature.name}</span><span>${actPrice}</span></li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="font-bold text-lg mt-3 mbg-text-accent">Total: ${totalPrice}</div>
                  <div className="text-xs text-gray-500 mt-2">* Max 2 activities per day. 6 day minimum stay.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testimonials Section */}
        <div className="mbg-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="mbg-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mbg-text-primary mb-4 text-center">
                Retreat Testimonials
              </h2>
              <p className="text-lg mbg-text-primary max-w-2xl mx-auto font-medium text-center">
                Hear from guests who have experienced the transformative power of our healing retreats
              </p>
            </div>
            {/* Testimonials Slideshow */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="mbg-card min-h-[300px] flex items-center transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing"
                >
                  <div className="w-full">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-110 border-2 border-green-500 bg-gray-100">
                          {testimonials[currentTestimonialIndex].image ? (
                            <img 
                              src={testimonials[currentTestimonialIndex].image} 
                              alt={`${testimonials[currentTestimonialIndex].name} profile`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const t = testimonials[currentTestimonialIndex];
                                  let initials = '??';
                                  if (t.name) {
                                    const parts = t.name.trim().split(' ');
                                    initials = parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                  }
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                      ${initials}
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {(() => {
                                const t = testimonials[currentTestimonialIndex];
                                if (t.name) {
                                  const parts = t.name.trim().split(' ');
                                  return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                }
                                return '??';
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold mbg-text-primary mb-2 transition-opacity duration-300">
                            {testimonials[currentTestimonialIndex].name}
                          </h4>
                          <p className="text-sm mbg-text-accent font-medium mb-1 transition-opacity duration-300">
                            {testimonials[currentTestimonialIndex].service}
                          </p>
                          <p className="text-xs mbg-text-secondary mb-2 transition-opacity duration-300">
                            {testimonials[currentTestimonialIndex].details}
                          </p>
                          <p className="text-xs mbg-text-secondary transition-opacity duration-300">
                            {testimonials[currentTestimonialIndex].location}
                          </p>
                        </div>
                        <blockquote className="mbg-text-primary italic leading-relaxed text-lg transition-opacity duration-300">
                          "{testimonials[currentTestimonialIndex].quote}"
                        </blockquote>
                        {testimonials[currentTestimonialIndex].hasMediaPopup && (
                          <div className="mt-6">
                            <button
                              onClick={() => setIsMediaPopupOpen(true)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border-2 border-white font-bold text-lg"
                              style={{ 
                                boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                              }}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>View Retreat Experience</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ border: '1px solid var(--mbg-primary-green)', position: 'absolute', zIndex: 30 }}
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ border: '1px solid var(--mbg-primary-green)', position: 'absolute', zIndex: 30 }}
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsSlideShowPaused((prev) => !prev)}
                className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ border: '1px solid var(--mbg-primary-green)', position: 'absolute', zIndex: 30 }}
                aria-label={isSlideShowPaused ? "Resume slideshow" : "Pause slideshow"}
              >
                {isSlideShowPaused ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v9a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentTestimonialIndex
                        ? 'shadow-lg scale-125'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      background: index === currentTestimonialIndex 
                        ? 'var(--mbg-primary-green)' 
                        : 'var(--mbg-medium-gray)'
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              {/* Progress Bar */}
              <div className="mt-6 w-full rounded-full h-1 overflow-hidden" style={{ background: 'var(--mbg-light-gray)' }}>
                <motion.div 
                  className="h-1 rounded-full"
                  style={{ 
                    background: 'linear-gradient(to right, var(--mbg-primary-green), var(--mbg-secondary-green))',
                  }}
                  animate={{ width: `${((currentTestimonialIndex + 1) / testimonials.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* Slide Counter */}
              <div className="absolute top-4 right-6 px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white'
              }}>
                {currentTestimonialIndex + 1} / {testimonials.length}
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="w-full flex justify-center mt-8">
                <div className="text-xs text-gray-700 italic font-medium max-w-2xl text-center">
                  All proceeds directly support the development of a vibrant, sustainable Eco Offgrid Community in St. Thomas, Jamaica, empowering regenerative living, education, and holistic well-being for all participants and future generations.
                </div>
              </div>
            </div>
          </div>
          {/* Media Popup */}
          {isMediaPopupOpen && (
            <MediaPopup
              onClose={() => {
                setIsMediaPopupOpen(false);
                setTimeout(() => setIsSlideShowPaused(false), 200);
              }}
              pauseSlideshow={() => {
                if (!isSlideShowPaused) setIsSlideShowPaused(true);
              }}
            />
          )}
          {/* FAQ Section */}
          <div className="mbg-section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="mbg-container">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mbg-text-primary mb-4">Frequently Asked Questions</h2>
                <p className="text-lg mbg-text-primary max-w-2xl mx-auto font-medium text-center">Find answers to common questions about our retreat tours and workshops.</p>
              </div>
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">What is included in a retreat tour package?</h3>
                  <p className="text-gray-700">All packages include accommodation, daily activities, transportation, meals, and guided experiences. You’ll receive a detailed itinerary and personal support throughout your stay.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">How do I book a retreat or workshop?</h3>
                  <p className="text-gray-700">Simply fill out the booking form above with your preferred dates, activities, and contact information. Our team will follow up to confirm details and help you prepare for your journey.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">Can I customize my experience?</h3>
                  <p className="text-gray-700">Absolutely! All retreats and workshops are fully customizable. You can choose your activities, locations, and dietary preferences. We’ll work with you to create a unique, personalized experience.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">Is transportation provided?</h3>
                  <p className="text-gray-700">Yes, all local transportation is included. We provide safe, comfortable vehicles and a dedicated guide for your group.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">What should I bring?</h3>
                  <p className="text-gray-700">We recommend bringing comfortable clothing, swimwear, sun protection, and any personal items you need. A full packing list will be provided after booking.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">Are retreats suitable for families?</h3>
                  <p className="text-gray-700">Yes! Our retreats are family-friendly and can be tailored for all ages. Please let us know about any special requirements or preferences.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold mbg-text-accent mb-2">How do I contact you for more information?</h3>
                  <p className="text-gray-700">You can reach us anytime at <a href="mailto:info@portalsofsamadhi.com" className="text-green-700 underline">info@portalsofsamadhi.com</a> or call <span className="font-semibold">1-510-291-9399</span>. We’re happy to answer any questions!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperiencesPage;
