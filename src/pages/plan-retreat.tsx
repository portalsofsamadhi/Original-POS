import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar, MapPin, Users, Clock as _Clock, Leaf, Heart, Brain, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';
import '../styles/mbg-aesthetics.css';

interface RetreatFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'accommodation' | 'healing' | 'wellness' | 'nutrition' | 'activities';
  icon: React.ReactNode;
  tiers: ('budget' | 'midrange' | 'luxury')[];
}

const retreatFeatures: RetreatFeature[] = [
  // Budget Tier Features (Essential) - 25+ options
  { id: 'shared-room', name: 'Shared Room', description: 'Comfortable shared accommodation with fellow retreat participants', price: 85, category: 'accommodation', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'dormitory-style', name: 'Dormitory Bunk', description: 'Budget-friendly bunk bed accommodation', price: 45, category: 'accommodation', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'camping-spot', name: 'Camping Spot', description: 'Bring your own tent camping area with facilities', price: 25, category: 'accommodation', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  
  { id: 'basic-meals', name: 'Healthy Meals', description: 'Three nutritious vegetarian meals daily', price: 65, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'breakfast-only', name: 'Breakfast Only', description: 'Healthy breakfast with access to kitchen', price: 25, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'herbal-teas-basic', name: 'Herbal Teas', description: 'Daily herbal tea service', price: 15, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'water-infusions', name: 'Infused Waters', description: 'Fruit and herb infused waters throughout the day', price: 10, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'communal-cooking', name: 'Communal Cooking', description: 'Shared kitchen access for group meal preparation', price: 35, category: 'nutrition', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },
  
  { id: 'group-yoga', name: 'Group Yoga', description: 'Daily group yoga sessions', price: 45, category: 'wellness', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'meditation-basic', name: 'Group Meditation', description: 'Daily group meditation practice', price: 35, category: 'wellness', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'nature-walks-basic', name: 'Nature Walks', description: 'Guided nature walks and hiking', price: 25, category: 'wellness', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'breathwork-basic', name: 'Breathwork Circle', description: 'Group breathing exercises', price: 45, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'morning-stretching', name: 'Morning Stretching', description: 'Gentle morning movement sessions', price: 25, category: 'wellness', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'beach-yoga', name: 'Beach Yoga', description: 'Yoga sessions on the beach or lakeside', price: 35, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'walking-meditation', name: 'Walking Meditation', description: 'Mindful walking practices in nature', price: 20, category: 'wellness', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  
  { id: 'sound-therapy-basic', name: 'Group Sound Bath', description: 'Weekly group sound healing sessions', price: 65, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'self-massage', name: 'Self-Massage Training', description: 'Learn basic self-massage techniques', price: 35, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'partner-massage', name: 'Couple Massage', description: 'Learn massage techniques with your partner', price: 45, category: 'healing', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },

  // Additional Healing & Therapy for Budget tier
  { id: 'guided-relaxation', name: 'Guided Relaxation', description: 'Deep relaxation sessions for stress relief', price: 20, category: 'healing', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'herbal-foot-soak', name: 'Herbal Foot Soak', description: 'Soothing herbal foot bath for detox and relaxation', price: 18, category: 'healing', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'group-reiki', name: 'Group Reiki Healing', description: 'Group energy healing session for balance and renewal', price: 28, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'aroma-breath', name: 'Aromatherapy Breathwork', description: 'Breathwork with essential oils for emotional release', price: 22, category: 'healing', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'healing-circle', name: 'Healing Circle', description: 'Supportive group healing and sharing circle', price: 15, category: 'healing', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },
  
  { id: 'workshops-basic', name: 'Wellness Workshops', description: 'Educational wellness workshops', price: 55, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'journaling-basic', name: 'Journaling Sessions', description: 'Guided journaling for self-reflection', price: 35, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'group-games', name: 'Wellness Games', description: 'Fun group activities and team building', price: 25, category: 'activities', icon: <Users className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'campfire-circle', name: 'Campfire Circles', description: 'Evening storytelling and sharing circles', price: 15, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'sunrise-gathering', name: 'Sunrise Gatherings', description: 'Morning intention setting gatherings', price: 20, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'nature-crafts', name: 'Nature Crafts', description: 'Create art using natural materials', price: 30, category: 'activities', icon: <Leaf className="w-5 h-5" />, tiers: ['budget'] },
  { id: 'group-singing', name: 'Group Singing', description: 'Community singing and chanting sessions', price: 25, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['budget'] },

  // Mid-Range Tier Features (Enhanced) - 30+ options
  { id: 'private-room', name: 'Private Room', description: 'Individual luxury accommodation with private bathroom', price: 185, category: 'accommodation', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'glamping', name: 'Luxury Glamping', description: 'Eco-friendly glamping experience in nature', price: 145, category: 'accommodation', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange'] },
  { id: 'mountain-cabin', name: 'Mountain Cabin', description: 'Rustic luxury cabin with mountain vistas', price: 165, category: 'accommodation', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange'] },
  { id: 'lake-cottage', name: 'Lake Cottage', description: 'Charming cottage overlooking the lake', price: 155, category: 'accommodation', icon: <Heart className="w-5 h-5" />, tiers: ['midrange'] },
  { id: 'forest-cabin', name: 'Forest Cabin', description: 'Secluded cabin deep in the forest', price: 135, category: 'accommodation', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange'] },
  
  { id: 'organic-meals', name: 'Organic Gourmet Meals', description: 'Three organic, locally-sourced gourmet meals daily', price: 115, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'juice-cleanse', name: 'Juice Cleanse Program', description: 'Cold-pressed juice detox program', price: 95, category: 'nutrition', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'smoothie-bar', name: 'Daily Smoothie Bar', description: 'Fresh smoothies with superfoods', price: 45, category: 'nutrition', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'nutrition-coaching', name: 'Nutrition Coaching', description: 'Personal nutrition consultation', price: 125, category: 'nutrition', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'meal-planning', name: 'Meal Planning Session', description: 'Learn to plan healthy meals at home', price: 65, category: 'nutrition', icon: <Brain className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'supplement-consultation', name: 'Supplement Consultation', description: 'Personalized supplement recommendations', price: 85, category: 'nutrition', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  
  { id: 'yoga-classes', name: 'Premium Yoga Classes', description: 'Small group yoga with certified instructors', price: 75, category: 'wellness', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'meditation', name: 'Guided Meditation', description: 'Personalized meditation instruction', price: 55, category: 'wellness', icon: <Brain className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'breathwork', name: 'Advanced Breathwork', description: 'Transformational breathing techniques', price: 85, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'qigong', name: 'Qigong Practice', description: 'Traditional Chinese energy cultivation', price: 65, category: 'wellness', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'tai-chi', name: 'Tai Chi Classes', description: 'Flowing martial arts for balance and peace', price: 55, category: 'wellness', icon: <Brain className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'pilates', name: 'Pilates Sessions', description: 'Core strengthening and flexibility', price: 65, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'forest-bathing', name: 'Forest Bathing', description: 'Immersive nature therapy sessions', price: 45, category: 'wellness', icon: <Leaf className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'water-therapy', name: 'Water Therapy', description: 'Healing sessions in natural water', price: 75, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  
  { id: 'massage-therapy', name: 'Therapeutic Massage', description: 'Professional therapeutic massage sessions', price: 125, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'energy-healing', name: 'Energy Healing', description: 'Reiki and chakra balancing sessions', price: 105, category: 'healing', icon: <Brain className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'sound-therapy', name: 'Private Sound Therapy', description: 'Individual crystal bowl healing sessions', price: 85, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'hot-stone-massage', name: 'Hot Stone Massage', description: 'Relaxing heated stone therapy', price: 135, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'lymphatic-drainage', name: 'Lymphatic Drainage', description: 'Gentle detox massage therapy', price: 115, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'myofascial-release', name: 'Myofascial Release', description: 'Deep tissue tension release therapy', price: 125, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  
  { id: 'spa-treatments', name: 'Spa Treatments', description: 'Facial, body wraps, and spa services', price: 145, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'art-therapy', name: 'Art Therapy Sessions', description: 'Creative expression for healing', price: 85, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'photography-workshop', name: 'Nature Photography', description: 'Capture the beauty of your retreat', price: 75, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'cooking-class', name: 'Healthy Cooking Class', description: 'Learn to prepare nutritious meals', price: 85, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'pottery-class', name: 'Pottery Workshop', description: 'Create ceramics in a mindful way', price: 95, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },
  { id: 'drum-circle', name: 'Drum Circle', description: 'Rhythmic healing and community building', price: 55, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['midrange', 'luxury'] },

  // Luxury Tier Features (Ultimate) - 40+ options
  { id: 'ocean-view', name: 'Ocean View Villa', description: 'Luxury villa with panoramic ocean views', price: 285, category: 'accommodation', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'treehouse', name: 'Treehouse Suite', description: 'Elevated sanctuary nestled in ancient trees', price: 245, category: 'accommodation', icon: <Leaf className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'eco-dome', name: 'Eco Dome', description: 'Sustainable dome accommodation with stargazing roof', price: 225, category: 'accommodation', icon: <Leaf className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'cliff-suite', name: 'Cliff-top Suite', description: 'Dramatic clifftop accommodation with views', price: 315, category: 'accommodation', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'floating-house', name: 'Floating House', description: 'Unique overwater accommodation', price: 295, category: 'accommodation', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'penthouse-suite', name: 'Penthouse Suite', description: 'Ultimate luxury with butler service', price: 425, category: 'accommodation', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  
  { id: 'private-chef', name: 'Private Chef Service', description: 'Personal chef for customized meals', price: 185, category: 'nutrition', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'wine-pairing', name: 'Wine Pairing Dinners', description: 'Organic wine paired with gourmet meals', price: 125, category: 'nutrition', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'molecular-gastronomy', name: 'Molecular Gastronomy', description: 'Cutting-edge culinary experiences', price: 165, category: 'nutrition', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'truffle-dining', name: 'Truffle Dining Experience', description: 'Luxury dining with rare ingredients', price: 225, category: 'nutrition', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'tea-ceremony', name: 'Traditional Tea Ceremony', description: 'Authentic ceremonial tea experiences', price: 85, category: 'nutrition', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] },
  
  { id: 'private-yoga', name: 'Private Yoga Instruction', description: 'One-on-one yoga with master teacher', price: 155, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'aerial-yoga', name: 'Aerial Yoga', description: 'Anti-gravity yoga in silk hammocks', price: 95, category: 'wellness', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'dance-therapy', name: 'Dance Movement Therapy', description: 'Expressive movement for emotional release', price: 105, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'cold-therapy', name: 'Cold Water Therapy', description: 'Ice baths and cold plunge for resilience', price: 85, category: 'wellness', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'sauna-sessions', name: 'Sauna & Steam', description: 'Private sauna and steam room sessions', price: 75, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'personal-trainer', name: 'Personal Trainer', description: 'One-on-one fitness coaching', price: 125, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'surfing-lessons', name: 'Private Surfing Lessons', description: 'Learn to surf with expert instruction', price: 135, category: 'wellness', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'rock-climbing', name: 'Rock Climbing', description: 'Guided climbing experiences', price: 115, category: 'wellness', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'surfing-lessons', name: 'Private Surfing Lessons', description: 'Learn to surf with expert instruction', price: 135, category: 'wellness', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  
  { id: 'acupuncture', name: 'Acupuncture Sessions', description: 'Traditional acupuncture healing sessions', price: 165, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'craniosacral', name: 'Craniosacral Therapy', description: 'Gentle manipulation of skull and spine', price: 145, category: 'healing', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'crystal-healing', name: 'Crystal Healing', description: 'Therapeutic crystal placement and energy work', price: 125, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'reflexology', name: 'Reflexology', description: 'Foot pressure point therapy', price: 95, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'aromatherapy', name: 'Aromatherapy Sessions', description: 'Essential oil therapy for emotional healing', price: 75, category: 'healing', icon: <Leaf className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'cupping-therapy', name: 'Cupping Therapy', description: 'Ancient Chinese healing technique', price: 105, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'gua-sha', name: 'Gua Sha Therapy', description: 'Traditional Chinese scraping therapy', price: 85, category: 'healing', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'bioenergetic-healing', name: 'Bioenergetic Healing', description: 'Advanced energy field therapy', price: 165, category: 'healing', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'quantum-healing', name: 'Quantum Healing', description: 'Cutting-edge consciousness healing', price: 195, category: 'healing', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  
  { id: 'plant-medicine', name: 'Plant Medicine Ceremony', description: 'Sacred plant ceremonies with experienced guides', price: 285, category: 'activities', icon: <Leaf className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'horseback-therapy', name: 'Equine Therapy', description: 'Healing interactions with horses', price: 145, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'music-therapy', name: 'Music Therapy', description: 'Healing through sound and rhythm', price: 85, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'fire-ceremony', name: 'Fire Ceremonies', description: 'Transformational fire rituals', price: 75, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'water-ceremony', name: 'Water Ceremonies', description: 'Sacred water rituals for purification', price: 65, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'stargazing', name: 'Guided Stargazing', description: 'Celestial observation and cosmic meditation', price: 55, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'concierge-service', name: 'Concierge Service', description: '24/7 personal concierge assistance', price: 95, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'helicopter-tour', name: 'Helicopter Tour', description: 'Aerial tour of the retreat location', price: 285, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'yacht-excursion', name: 'Private Yacht Excursion', description: 'Luxury boat trip with gourmet lunch', price: 325, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'wine-tasting', name: 'Premium Rum Tasting', description: 'Curated rum tasting experience', price: 125, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'shopping-tour', name: 'Luxury Shopping Tour', description: 'Guided tour to local artisans and boutiques', price: 95, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'cultural-immersion', name: 'Cultural Immersion', description: 'Deep dive into local culture and traditions', price: 115, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] },
  { id: 'private-beach', name: 'Private Beach Access', description: 'Exclusive access to private beach area', price: 165, category: 'activities', icon: <Heart className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'meditation-cave', name: 'Cave Meditation', description: 'Meditate in natural crystal caves', price: 85, category: 'activities', icon: <Sparkles className="w-5 h-5" />, tiers: ['luxury'] },
  // { id: 'shamanic-journey', name: 'Shamanic Journey', description: 'Traditional shamanic healing experience', price: 195, category: 'activities', icon: <Brain className="w-5 h-5" />, tiers: ['luxury'] }
];

const PlanRetreatPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [retreatDetails, setRetreatDetails] = useState({
    startDate: '',
    endDate: '',
    participants: 1,
    location: '',
    specialRequests: ''
  });  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''  });
  // Pricing tiers
  const [selectedPricingTier, setSelectedPricingTier] = useState<'budget' | 'midrange' | 'luxury'>('midrange');
    const pricingTiers = {
    budget: { name: 'Budget', price: 250, description: 'Essential retreat experience', isBasePrice: true },
    midrange: { name: 'Mid-Range', price: 375, description: 'Enhanced retreat with premium amenities', isBasePrice: false },
    luxury: { name: 'Luxury', price: 525, description: 'Ultimate luxury retreat experience', isBasePrice: false }
  };
  
  const basePricePerDay = pricingTiers[selectedPricingTier].isBasePrice 
    ? pricingTiers[selectedPricingTier].price 
    : pricingTiers[selectedPricingTier].price;
  
  // State for testimonials slideshow
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState<string | null>(null);
  const [enlargedImageAlt, setEnlargedImageAlt] = useState<string>('');
  
  // Testimonial interface
  interface _Testimonial {
    id: number;
    name: string;
    service: string;
    details: string;
    location: string;
    quote: string;
    initial: string;
    image: string;
    hasMediaPopup?: boolean;
  }
  // Testimonials data
  const testimonials = [
    {
      id: 0,
      name: "DH",
      service: "Custom Healing Retreat",
      details: "Premium Retreat Experience",
      location: "2025",
      quote: "It was fantastic! It was everything I was hoping for and more.",
      initial: "DH",
      image: "/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png",
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
      initial: "RG",
      image: "/images/testimonials/hildegard-avatar.jpg"
    },
    {
      id: 2,
      name: "Hugo L",
      service: "Vegan Culinary Experience",
      details: "5-Star Review",
      location: "January 2020",
      quote: "It was so pleasing. They present a very tasty vegan repertoire of dishes. Also they're incredibly warm hearted and seeking for a great interaction. All of that is reflected on their incredibly organic tasty food!",
      initial: "HL",
      image: "/images/testimonials/hugo-avatar.jpg"
    },
    {
      id: 3,
      name: "Carol",
      service: "Retreat Experience",
      details: "Mindful Elevation Journey",
      location: "September 2022",
      quote: "Such beautiful souls...adding radiant glory to our universe. This visit will ensure you grounding in a true loving environment. So proud to be a part of experiencing mindful and conscious elevation. It's a true gift when others are able to love, give and share so effortlessly - while you are being displaced from your own comforts. Try their tea - The Best!!! A+++++",
      initial: "C",
      image: "/images/testimonials/carol-avatar.jpg"
    },
    {
      id: 4,
      name: "Julia",
      service: "4-Day Retreat & Sound Bath",
      details: "Mother-Daughter Retreat",
      location: "September 2022",
      quote: "My daughter and I stayed for a 4 day retreat and loved our hosts, beautiful people! The Sound Bath experience was very relaxing. Plenty of space to relax in and comfortable bed.",
      initial: "J",
      image: "/images/testimonials/julia-avatar.jpg"
    }
  ];
  // Slideshow navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonialIndex(index);
  };

  const toggleSlideShowPause = () => {
    setIsSlideShowPaused(!isSlideShowPaused);
  };

  // Auto-advance slideshow  // Auto-advance slideshow
  useEffect(() => {
    if (!isSlideShowPaused) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Change slide every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isSlideShowPaused, testimonials.length]);
  // Keyboard support for media popup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMediaPopupOpen) {
        setIsMediaPopupOpen(false);
      }
    };

    if (isMediaPopupOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      // Ensure scroll is restored when popup is closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.documentElement.style.scrollBehavior = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Always restore scroll
      document.body.style.position = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, [isMediaPopupOpen]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  const calculateDays = () => {
    if (retreatDetails.startDate && retreatDetails.endDate) {
      const start = new Date(retreatDetails.startDate);
      const end = new Date(retreatDetails.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 3; // Default 3 days
  };
  const calculateTotalPrice = () => {
    const days = calculateDays();
    const participants = retreatDetails.participants;
    
    // Budget pricing is a flat base price, others are per day
    const baseTotal = pricingTiers[selectedPricingTier].isBasePrice 
      ? pricingTiers[selectedPricingTier].price * participants  // Budget: base price per participant
      : basePricePerDay * days * participants;  // Others: per day per participant
    
    const featuresTotal = selectedFeatures.reduce((total, featureId) => {
      const feature = retreatFeatures.find(f => f.id === featureId);
      return total + (feature ? feature.price * days * participants : 0);
    }, 0);
    
    return baseTotal + featuresTotal;
  };

  // Image enlargement functions
  const handleImageClick = (src: string, alt: string) => {
    setEnlargedImageSrc(src);
    setEnlargedImageAlt(alt);
  };

  const closeEnlargedImage = () => {
    setEnlargedImageSrc(null);
    setEnlargedImageAlt('');
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };  const handleBookRetreat = () => {
    // Validate required fields
    const missingFields = [];
    if (!contactInfo.name.trim()) missingFields.push('Full Name');
    if (!contactInfo.email.trim()) missingFields.push('Email Address');
    if (!retreatDetails.startDate) missingFields.push('Start Date');
    if (!retreatDetails.endDate) missingFields.push('End Date');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate dates
    const startDate = new Date(retreatDetails.startDate);
    const endDate = new Date(retreatDetails.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      alert('Start date cannot be in the past');
      return;
    }

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    // Create detailed notes with selected features
    const selectedFeatureNames = selectedFeatures
      .map(id => retreatFeatures.find(f => f.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const detailedNotes = `Custom retreat from ${retreatDetails.startDate} to ${retreatDetails.endDate} for ${retreatDetails.participants} participant(s).
    
Selected Features: ${selectedFeatureNames || 'Base package only'}
Location Preference: ${retreatDetails.location || 'No preference'}
Special Requests: ${retreatDetails.specialRequests || 'None'}

Duration: ${calculateDays()} days
${pricingTiers[selectedPricingTier].name} Price: $${pricingTiers[selectedPricingTier].isBasePrice 
  ? pricingTiers[selectedPricingTier].price * retreatDetails.participants
  : basePricePerDay * calculateDays() * retreatDetails.participants}
Features Total: $${selectedFeatures.reduce((total, featureId) => {
  const feature = retreatFeatures.find(f => f.id === featureId);
  return total + (feature ? feature.price * calculateDays() * retreatDetails.participants : 0);
}, 0)}`;

    // Navigate to payment page with retreat booking data
    navigate('/booking', { 
      state: { 
        serviceId: 'custom-retreat',
        serviceName: 'Custom Healing Retreat',
        servicePrice: calculateTotalPrice(),
        serviceDuration: `${calculateDays()} days`,
        practitionerName: 'Retreat Team',
        date: retreatDetails.startDate,
        time: 'Check-in: 2:00 PM',
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        notes: detailedNotes
      }
    });
  };

  // Filter features based on selected tier
  const getFilteredFeatures = () => {
    return retreatFeatures.filter(feature => 
      feature.tiers.includes(selectedPricingTier)
    );
  };

  const groupedFeatures = getFilteredFeatures().reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, RetreatFeature[]>);

  // Reset selected features when tier changes
  const handleTierChange = (newTier: 'budget' | 'midrange' | 'luxury') => {
    setSelectedPricingTier(newTier);
    // Clear selected features that don't belong to the new tier
    const newTierFeatureIds = retreatFeatures
      .filter(f => f.tiers.includes(newTier))
      .map(f => f.id);
    setSelectedFeatures(prev => 
      prev.filter(featureId => newTierFeatureIds.includes(featureId))
    );
  };

  const categoryNames = {
    accommodation: 'Accommodation',
    healing: 'Healing & Therapy',
    wellness: 'Wellness Activities',
    nutrition: 'Nutrition & Detox',
    activities: 'Special Activities'
  };  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflow: 'visible'
      }}
    >{/* Background overlay for 15% opacity effect */}
      <div 
        className="absolute inset-0 bg-gray-800"
        style={{ opacity: 0.85 }}
      ></div>
      
      <div className="relative z-10">
        <SEO 
          title={PAGE_SEO["/plan-retreat"].title}
          description={PAGE_SEO["/plan-retreat"].description}
          image={PAGE_SEO["/plan-retreat"].image}
          imageAlt={PAGE_SEO["/plan-retreat"].imageAlt}
          url="/plan-retreat"
        />        {/* Hero Section */}
        <div className="relative bg-transparent text-white">
          {/* Remove background image and overlay for clean white background */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">              <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 text-white">
                Plan Your Custom
                <span className="block text-green-400">
                  Healing Retreat
                </span>
              </h1>              <p className="text-xl md:text-2xl font-light text-white max-w-3xl mx-auto mb-8">
                Our commitment to authentic healing flows from a foundation of genuine love and care. We honor each individual's sacred journey, drawing upon years of profound transformational work that has created lasting spiritual and healing impact for all who trust us with their wellness path.
              </p>

              <div className="flex justify-center space-x-8 text-sm font-light">                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-white">Custom Duration</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-white">Serene Locations</span>
                </div>                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-white">Personal & Group</span>
                </div>
            </div>
          </div>        </div>
      </div>      <div className="mbg-bg-white">
        <div className="mbg-container" style={{ padding: '4rem 1.5rem' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Retreat Configuration */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Details */}
            <Card className="mbg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-light mbg-text-primary flex items-center">
                  <Calendar className="w-6 h-6 mr-3 mbg-text-accent" />
                  Retreat Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium mbg-text-secondary">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={retreatDetails.startDate}
                      onChange={(e) => setRetreatDetails(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1 mbg-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium mbg-text-secondary">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={retreatDetails.endDate}
                      onChange={(e) => setRetreatDetails(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1 mbg-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participants" className="text-sm font-medium mbg-text-secondary">Number of Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      max="20"
                      value={retreatDetails.participants}
                      onChange={(e) => setRetreatDetails(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                      className="mt-1 mbg-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium mbg-text-secondary">Preferred Location</Label>
                    <Input
                      id="location"
                      placeholder="Mountains, Beach, Forest, etc."
                      value={retreatDetails.location}
                      onChange={(e) => setRetreatDetails(prev => ({ ...prev, location: e.target.value }))}
                      className="mt-1 mbg-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>            {/* Feature Selection */}
            {Object.entries(groupedFeatures).map(([category, features]) => (
              <Card key={category} className="mbg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-light mbg-text-primary">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => {
                      const checked = selectedFeatures.includes(feature.id);
                      function handleFeatureDaysChange(_id: string, _arg1: number): void {
                        throw new Error('Function not implemented.');
                      }

                      return (
                        <div key={feature.id} className="mbg-card-small flex items-center space-x-3">
                          <Checkbox
                            id={feature.id}
                            checked={checked}
                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={feature.id} className="font-medium mbg-text-primary cursor-pointer flex items-center">
                                {feature.icon}
                                <span className="ml-2">{feature.name}</span>
                              </Label>
                              <span className="mbg-text-accent font-semibold">${feature.price}/day</span>
                            </div>
                            <p className="text-sm mbg-text-secondary mt-1">{feature.description}</p>
                            {checked && (
                              <div className="mt-2 flex items-center space-x-2">
                                <label htmlFor={`days-${feature.id}`} className="text-xs mbg-text-secondary">Days:</label>
                                <input
                                  id={`days-${feature.id}`}
                                  type="number"
                                  min={1}
                                  max={calculateDays()}
                                  value={features[feature.id] ?? calculateDays()}
                                  onChange={e => handleFeatureDaysChange(feature.id, parseInt(e.target.value) || 1)}
                                  className="w-16 px-2 py-1 border rounded text-sm mbg-input"
                                  style={{ background: '#fff', color: '#222' }}
                                />
                                <span className="text-xs mbg-text-secondary">(of {calculateDays()} total)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}            {/* Contact Information */}            <Card className="mbg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-light mbg-text-primary">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mbg-text-secondary">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 mbg-input"
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests" className="text-sm font-medium mbg-text-secondary">Special Requests or Dietary Requirements</Label>
                  <Textarea
                    id="specialRequests"
                    rows={4}
                    value={retreatDetails.specialRequests}
                    onChange={(e) => setRetreatDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                    className="mt-1 mbg-input"
                    placeholder="Please share any specific needs, dietary restrictions, health conditions, or special requests..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>          {/* Pricing Summary */}
          <div className="space-y-6">            <Card className="mbg-card sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-light mbg-text-primary">
                  Retreat Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                {/* Pricing Tier Selection */}
                <div className="space-y-3 pb-4 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                  <h4 className="font-medium mbg-text-primary mb-3">Select Experience Level</h4>                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(pricingTiers).map(([key, tier]) => (
                      <button
                        key={key}
                        onClick={() => handleTierChange(key as 'budget' | 'midrange' | 'luxury')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                          selectedPricingTier === key
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {selectedPricingTier === key && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          <div>
                            <div className={`font-semibold ${
                              selectedPricingTier === key ? 'mbg-text-accent' : 'mbg-text-primary'
                            }`}>
                              {tier.name}
                              {key === 'midrange' && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="text-xs mbg-text-secondary">{tier.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Duration</span>
                    <span className="font-medium mbg-text-primary">{calculateDays()} days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">Participants</span>
                    <span className="font-medium mbg-text-primary">{retreatDetails.participants}</span>
                  </div>                  <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--mbg-light-gray)' }}>
                    <span className="mbg-text-secondary">{pricingTiers[selectedPricingTier].name} Price</span>
                    <span className="font-medium mbg-text-primary">
                      ${pricingTiers[selectedPricingTier].isBasePrice 
                        ? pricingTiers[selectedPricingTier].price * retreatDetails.participants
                        : basePricePerDay * calculateDays() * retreatDetails.participants}
                    </span>
                  </div>
                  
                  {selectedFeatures.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium mbg-text-primary">Selected Features:</h4>
                      {selectedFeatures.map(featureId => {
                        const feature = retreatFeatures.find(f => f.id === featureId);
                        if (!feature) return null;
                        const numDays = featureId[featureId] ?? calculateDays();
                        const featureTotal = feature.price * numDays * retreatDetails.participants;
                        return (
                          <div key={featureId} className="flex justify-between items-center text-sm">
                            <span className="mbg-text-secondary">{feature.name} <span className="ml-2 text-xs">({numDays} day{numDays > 1 ? 's' : ''})</span></span>
                            <span className="font-medium mbg-text-primary">${featureTotal}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}                  <div className="flex justify-between items-center py-3 border-t-2" style={{ borderColor: 'var(--mbg-primary-green)' }}>
                    <span className="text-lg font-semibold mbg-text-accent">Total Investment</span>
                    <span className="text-2xl font-bold mbg-text-accent">${calculateTotalPrice()}</span>
                  </div>
                    <div className="mbg-card-highlight" style={{ 
                    background: 'var(--mbg-light-green)', 
                    border: `1px solid var(--mbg-primary-green)`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}>
                    <p className="text-sm mbg-text-accent text-center">
                      <strong>Premium Experience:</strong> Led by practitioners with 20+ years of holistic healing expertise, 
                      ensuring transformative results through personalized care.
                    </p>
                  </div>
                </div>
                  <Button 
                  onClick={handleBookRetreat}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Book Your Retreat                </Button>                  <p className="text-sm mbg-text-secondary text-center">
                  Secure payment processing • Full refund if cancelled 48hrs before start&nbsp;date
                </p>
              </CardContent>
            </Card></div>          </div>
        </div>
      </div>
      </div>        {/* Testimonials Section */}
        <div className="mbg-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="mbg-container">            <div className="text-center mb-12"><div className="mbg-badge" style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: 'var(--mbg-light-green)',
                color: 'var(--mbg-accent-green)',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                border: '2px solid var(--mbg-primary-green)'
              }}>
                Client Experiences
              </div><h2 className="text-3xl md:text-4xl font-bold mbg-text-primary mb-4">
                Retreat Testimonials
              </h2>
              <p className="text-lg mbg-text-primary max-w-2xl mx-auto font-medium">
                Hear from guests who have experienced the transformative power of our healing retreats
              </p>
            </div>

            {/* Testimonials Slideshow */}
            <div className="relative max-w-4xl mx-auto mb-16">              {/* Main Testimonial Card */}
              <div 
                className="mbg-card min-h-[300px] flex items-center transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="w-full">                  <div className="flex items-start space-x-6"><div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-110 border-2 border-green-500 bg-gray-100">
                        <img 
                          src={testimonials[currentTestimonialIndex].image} 
                          alt={`${testimonials[currentTestimonialIndex].name} profile`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  ${testimonials[currentTestimonialIndex].initial}
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>                    <div className="flex-1">
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
                        {/* Phone number only in popup, not here */}
                      </div>                      <blockquote className="mbg-text-primary italic leading-relaxed text-lg transition-opacity duration-300">
                        "{testimonials[currentTestimonialIndex].quote}"
                      </blockquote>{/* Media Button for DH Review */}
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>View Retreat Experience</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>              {/* Navigation Arrows */}              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ 
                  border: '1px solid var(--mbg-primary-green)',
                  position: 'absolute',
                  zIndex: 30
                }}
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ 
                  border: '1px solid var(--mbg-primary-green)',
                  position: 'absolute',
                  zIndex: 30
                }}
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>              {/* Play/Pause Button */}
              <button
                onClick={toggleSlideShowPause}
                className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-12 h-12 mbg-bg-white mbg-text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                style={{ 
                  border: '1px solid var(--mbg-primary-green)',
                  position: 'absolute',
                  zIndex: 30
                }}
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
                {testimonials.map((_, index) => (                    <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
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
              </div>              {/* Progress Bar */}
              <div className="mt-6 w-full rounded-full h-1 overflow-hidden" style={{ background: 'var(--mbg-light-gray)' }}>
                <div 
                  className="h-1 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    background: 'linear-gradient(to right, var(--mbg-primary-green), var(--mbg-secondary-green))',
                    width: `${((currentTestimonialIndex + 1) / testimonials.length) * 100}%` 
                  }}
                ></div>
              </div>

              {/* Slide Counter */}
              <div className="absolute top-4 right-6 px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white'
              }}>
                {currentTestimonialIndex + 1} / {testimonials.length}
              </div>
            </div>            <div className="text-center mt-8">
              <p className="text-lg mbg-text-primary mb-6 font-bold">
                Ready to create your own transformative retreat experience?
              </p>
            </div>
          </div>
        </div>

        {/* Sophisticated Media Popup Modal */}
        {isMediaPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm">
            <div className="relative max-w-6xl w-full max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-600 overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setIsMediaPopupOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">DH's Retreat Experience</h3>
                <p className="text-green-100">Journey Through Transformation - 2025</p>
              </div>

              {/* Content Area */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">                {/* Images Grid */}                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="group relative overflow-hidden rounded-xl cursor-pointer" onClick={() => handleImageClick("/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png", "Hiking after Bath")}>
                    <img 
                      src="/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png" 
                      alt="Hiking after Bath"
                      className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                      style={{ objectPosition: 'center 30%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                      Hiking after Bath
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl cursor-pointer" onClick={() => handleImageClick("/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png", "Having a blast at Bath Fountain's Hotspring")}>
                    <img 
                      src="/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png" 
                      alt="Having a blast at Bath Fountain's Hotspring"
                      className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                      style={{ objectPosition: 'center 80%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                      Having a blast at Bath Fountain's Hotspring
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden rounded-xl cursor-pointer" onClick={() => handleImageClick("/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png", "Strawberry Hills")}>
                    <img 
                      src="/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png" 
                      alt="Strawberry Hills"
                      className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                      Strawberry Hills
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden rounded-xl cursor-pointer" onClick={() => handleImageClick("/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png", "Bath Fountain")}>
                    <img 
                      src="/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png" 
                      alt="Bath Fountain"
                      className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                      Bath Fountain
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl md:col-span-2 cursor-pointer" onClick={() => handleImageClick("/images/Cell Phone/Picsart_25-06-23_02-43-32-743.png", "Dr. Cave's Beach")}>
                    <img 
                      src="/images/Cell Phone/Picsart_25-06-23_02-43-32-743.png" 
                      alt="Dr. Cave's Beach"
                      className="w-full aspect-[8/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                      style={{ objectPosition: 'center 30%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                      Dr. Cave's Beach
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Videos Section */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Highlights
                  </h4>                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                      <h5 className="text-white font-medium mb-3">Worthy Distillery</h5>
                      <video 
                        controls 
                        className="w-full aspect-video rounded-lg shadow-md"
                        poster="/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png"
                      >
                        <source src="/images/Cell Phone/VID-20250623-WA0000.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                      <h5 className="text-white font-medium mb-3">Strawberry Hills</h5>
                      <video 
                        controls 
                        className="w-full aspect-video rounded-lg shadow-md"
                        poster="/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png"
                      >
                        <source src="/images/Cell Phone/VID_20250618_173929448.mp4#t=20" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>                {/* Testimonial Quote */}
                <div className="mt-8 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-green-400 bg-gray-800">
                      <img 
                        src="/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png" 
                        alt="DH profile"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                DH
                              </div>
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
                      {/* Show phone number only if present and only in popup */}
                      {testimonials[0].phone && (
                        <p className="text-green-200 text-sm mt-2 font-semibold">
                          US Phone: {testimonials[0].phone} <span className="font-normal">(call to inquire about Retreat experience &amp; Tour)</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>        )}        {/* Image Enlargement Modal */}
        {enlargedImageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-95 backdrop-blur-sm" onClick={closeEnlargedImage}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeEnlargedImage}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Enlarged Image - Full photo visible */}
              <img 
                src={enlargedImageSrc} 
                alt={enlargedImageAlt}
                className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  objectFit: 'contain',
                  width: 'auto',
                  height: 'auto'
                }}
              />

              {/* Image Title */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full">
                <p className="text-lg font-medium">{enlargedImageAlt}</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PlanRetreatPage;
