// Retreat Tours Page
// This file was adapted from plan-retreat.tsx to focus on Retreat Tours only.
// Features: Tour details, accommodation, rental type (Jamaican vehicles), individual & group size options, and testimonials.

import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';

// Retreat Options for all guests
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
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

// Schema.org structured data for SEO
const retreatToursSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Retreat Tours, Wellness Retreats, Family Travel, Healing Journeys, Jamaica Tours",
  "provider": {
    "@type": "Organization",
    "name": "Portals of Samadhi"
  },
  "areaServed": "Jamaica",
  "url": "https://portalsofsamadhi.com/retreat-tours"
};

import { Users as _Users, Car as _Car, MapPin, Calendar as _Calendar } from 'lucide-react';

const vehicleTypes = [
  { id: 'sedan', name: 'Sedan (Toyota Axio, Nissan AD, Honda Fit, etc.)', capacity: 3 },
  { id: 'minivan', name: 'Minivan (Toyota Noah, Nissan Serena, Toyota Voxy, etc.)', capacity: 6 },
  { id: 'jeep', name: '4x4 Jeep (Suzuki Vitara, Toyota Prado, Land Cruiser, etc.)', capacity: 4 },
  { id: 'pickup', name: 'Pickup Truck (Toyota Hilux, Isuzu D-Max, etc.)', capacity: 4 },
  { id: 'wagon', name: 'Wagon (Toyota Fielder, Nissan Wingroad, etc.)', capacity: 4 },
  { id: 'suv', name: 'SUV (Honda CR-V, Toyota RAV4, Nissan X-Trail, etc.)', capacity: 5 },
  { id: 'compact', name: 'Compact (Suzuki Swift, Toyota Yaris, etc.)', capacity: 3 },
];

const accommodationTypes = [
  { id: 'guesthouse', name: 'Guesthouse' },
  { id: 'villa', name: 'Villa' },
  { id: 'hotel', name: 'Hotel' },
  { id: 'eco-lodge', name: 'Eco-Lodge' },
  { id: 'boutique', name: 'Boutique Hotel' },
  { id: 'airbnb', name: 'Airbnb/Short-Term Rental' },
  { id: 'resort', name: 'Resort' },
  { id: 'camping', name: 'Camping' },
  { id: 'homestay', name: 'Homestay' },
  { id: 'hostel', name: 'Hostel' },
];

const _tourDestinations = [
  'Blue Mountains',
  'Portland Beaches',
  'St. Thomas Hot Springs',
  'Kingston Culture Tour',
  'St. Mary River Rafting',
  'Ocho Rios Waterfalls',
  'Negril Cliffs',
  'Treasure Beach',
  'Local Farms & Ital Food',
  'Secret Caves & Springs',
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

const RetreatToursPage: React.FC = () => {
  const [inquiryComplete, setInquiryComplete] = useState(false); // For persistent thank you message

  // Helper: Reset inquiryComplete if user starts a new inquiry
  function handleTourFieldChange(fn) {
    return (...args) => {
      if (inquiryComplete) setInquiryComplete(false);
      fn(...args);
    };
  }

  // Helper: Clear all tour details fields
  function clearTourDetails() {
    setSelectedVehicle(vehicleTypes[0].id);
    setSelectedAccommodation(accommodationTypes[0].id);
    setNumParticipants(2);
    setStartDate('');
    setEndDate('');
    setPreferredLocation('');
    setSelectedDestinations([]);
    setSpecialRequests('');
    setSelectedRetreatOptions([]);
  }
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0].id);
  const [selectedAccommodation, setSelectedAccommodation] = useState(accommodationTypes[0].id);
  const [numParticipants, setNumParticipants] = useState(2);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [specialRequests, setSpecialRequests] = useState('');

  // Testimonial slideshow state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);

  // Retreat Options state
  const [selectedRetreatOptions, setSelectedRetreatOptions] = useState<string[]>([]);
  const [_showItinerary, _setShowItinerary] = useState(false);
  const [_itinerary, _setItinerary] = useState<unknown>(null);
  // Pricing logic (simple example, can be expanded)
  const BASE_PRICES: Record<string, number> = {
    'Healing & Wellness': 120,
    'Nature & Adventure': 100,
    'Premium Experience': 350,
  };

  function _calculatePrice() {
    let total = 0;
    let groupSurcharge = 0;
    selectedRetreatOptions.forEach((id) => {
      const opt = RETREAT_OPTIONS.find((o) => o.id === id);
      if (opt) {
        const price = BASE_PRICES[opt.group] || 100;
        total += price;
      }
    });
    // Add per-destination cost
    const destPrice = selectedDestinations.length * 80;
    if (selectedDestinations.length) {
      total += destPrice;
    }
    // Accommodation
    if (selectedAccommodation) {
      total += 90;
    }
    // Vehicle
    if (selectedVehicle) {
      total += 70;
    }
    // Number of participants surcharge
    if (numParticipants > 4) {
      groupSurcharge = (numParticipants - 4) * 30;
      total += groupSurcharge;
    }
    return { total, groupSurcharge };
  }


  const handleRetreatOptionToggle = (optionId: string) => {
    setSelectedRetreatOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

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

  const _handleDestinationToggle = (_destination: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(_destination)
        ? prev.filter((d) => d !== _destination)
        : [...prev, _destination]
    );
  };

    const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);



  // Send inquiry email to team and thank you email to user
  async function sendInquiryEmails(formData: unknown) {
    const typedFormData = formData as {
      contactInfo: { name: string; email: string; phone: string };
      startDate: string;
      endDate: string;
      numParticipants: number;
      preferredLocation: string;
      destinations: string[];
      accommodation: string;
      vehicle: string;
      retreatOptions: string[];
      specialRequests: string;
    };
    const { contactInfo } = typedFormData;
  const _detailsHtml = `
      <h2>New Retreat Tour Inquiry</h2>
      <p><b>Name:</b> ${contactInfo.name}</p>
      <p><b>Email:</b> ${contactInfo.email}</p>
      <p><b>Phone:</b> ${contactInfo.phone}</p>
      <p><b>Start Date:</b> ${typedFormData.startDate}</p>
      <p><b>End Date:</b> ${typedFormData.endDate}</p>
      <p><b>Number of Participants:</b> ${typedFormData.numParticipants}</p>
      <p><b>Preferred Location:</b> ${typedFormData.preferredLocation}</p>
      <p><b>Destinations:</b> ${typedFormData.destinations.join(', ')}</p>
      <p><b>Accommodation:</b> ${typedFormData.accommodation}</p>
      <p><b>Vehicle:</b> ${typedFormData.vehicle}</p>
      <p><b>Retreat Options:</b> ${typedFormData.retreatOptions.join(', ')}</p>
      <p><b>Special Requests:</b> ${typedFormData.specialRequests}</p>
    `;
    // Send to backend API (which will send both team and thank you emails)
    try {
      await fetch('/api/retreat-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  } catch (_err) {
      // Optionally handle error
    }
  }

  const [showThankYou, setShowThankYou] = useState(false);
  // Newsletter prompt removed: membership no longer requires newsletter signup
  // Password setup modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const _navigate = useNavigate();
  async function handleRequestTourInfo(e: React.FormEvent) {
    e.preventDefault();
    // Compose form data
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
    setShowThankYou(true);
    setInquiryComplete(true);
    clearTourDetails();
    await sendInquiryEmails(formData);
    // Now, wait for user to click Continue in Thank You popup
  }

    // Newsletter prompt is no longer used, so this is a no-op for compatibility
    function setShowNewsletterPrompt(_show: boolean) {
      // No action needed
    }
  return (
    <>
      <SEO
        title="Retreat Tours Jamaica – Gateway to Holistic Adventure & Family Wellness | Portals of Samadhi"
        description="Experience authentic Jamaican retreat tours with Portals of Samadhi. Journey with our family to hidden gems, healing destinations, and cultural adventures. Enjoy ital meals, spiritual insights, and real connection in a family-friendly, non-judgemental atmosphere."
        image="/images/Cell Phone/Picsart_25-07-12_20-46-17-231.png"
  url="https://portalsofsamadhi.com/retreat-tours"
        schemaType="Service"
        schemaData={retreatToursSchema}
      />
      <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(20,30,40,0.92) 0%, rgba(16,24,32,0.92) 60%, rgba(0,0,0,0.96) 100%), url('/images/Cell Phone/Picsart_25-07-12_20-46-17-231.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hero Section - overlay fills entire page */}
      <div className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-4 py-20" style={{ minHeight: '60vh' }}>
        {/* 1:1 Image */}
        <div className="flex-shrink-0 flex justify-center items-center mb-8 md:mb-0 md:mr-12">
          <img
            src="/images/Cell Phone/Picsart_25-07-12_20-46-17-231.png"
            alt="Retreat Tour Family"
            className="rounded-full shadow-2xl border-4 border-white object-cover"
            style={{ width: '320px', height: '320px', aspectRatio: '1/1', background: '#eee' }}
          />
        </div>
        {/* Description */}
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Retreat Tours
          </h1>
          <p className="text-xl md:text-2xl font-light text-white mb-6 drop-shadow-md">
            Our Retreat Tours are an organic and unique experience centered around hanging out with us and our children as we tour you throughout the Island, visiting amazing destinations off the beaten path. You receive the raw Jamaican experience with a Jamaican / American family. Expect ital alkaline meals, our signature teas and tinctures, forbidden history, healing sessions and deep spiritual insights in a non-judgemental, family-friendly atmosphere. We share our home, our stories, and our love for Jamaica with you. No filters, just real connection and adventure.
          </p>
        </div>
      </div>


      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tour Details Form or Thank You message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <style>{`
            @media (max-width: 640px) {
              .mbg-card, .mbg-section, .mbg-container {
                padding: 1.2rem !important;
                margin-bottom: 1.2rem !important;
              }
              .mbg-card .CardHeader { padding-bottom: 0.5rem !important; }
              .mbg-card .CardContent { padding-top: 0.5rem !important; }
              .mbg-input, .mbg-textarea { font-size: 1rem !important; padding: 0.7rem 1rem !important; }
              .mbg-card .CardTitle { font-size: 1.3rem !important; }
              .mbg-section h2, .mbg-section h3 { font-size: 1.2rem !important; }
              .mbg-section h1 { font-size: 1.7rem !important; }
              .mbg-section p, .mbg-card p, .mbg-card label { font-size: 1rem !important; }
              .mbg-section { padding-top: 2rem !important; padding-bottom: 2rem !important; }
              .mbg-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
              .mbg-card-small { margin-bottom: 0.8rem !important; }
              .mbg-btn, .mbg-card .Button { font-size: 1rem !important; padding: 0.7rem 1.2rem !important; }
            }
          `}</style>
          {/* Tour Details Form always visible */}
          <Card className="mbg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-light mbg-text-primary flex items-center">
                <MapPin className="w-6 h-6 mr-3 mbg-text-accent" />
                Tour Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={handleTourFieldChange(e => setStartDate(e.target.value))}
                    className="mbg-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={handleTourFieldChange(e => setEndDate(e.target.value))}
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
                    onChange={handleTourFieldChange(e => setNumParticipants(Number(e.target.value) || 1))}
                    className="mbg-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Preferred Location</label>
                  <Input
                    type="text"
                    value={preferredLocation}
                    onChange={handleTourFieldChange(e => setPreferredLocation(e.target.value))}
                    className="mbg-input w-full"
                    placeholder="e.g. Blue Mountains, Negril, etc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mbg-text-secondary mb-2">Accommodation Type</label>
                <select
                  value={selectedAccommodation}
                  onChange={handleTourFieldChange(e => setSelectedAccommodation(e.target.value))}
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
                  onChange={handleTourFieldChange(e => setSelectedVehicle(e.target.value))}
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
                  onChange={handleTourFieldChange(e => setSpecialRequests(e.target.value))}
                  className="mbg-input"
                  placeholder="Let us know about dietary needs, accessibility, or anything else."
                />
              </div>

              {/* Retreat Options Section (now inside Tour Details) */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold mbg-text-primary mb-4 text-center">Retreat Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Healing & Wellness */}
                  <div>
                    <h3 className="text-lg font-semibold mbg-text-accent mb-3">Healing & Wellness</h3>
                    <div className="space-y-2">
                      {RETREAT_OPTIONS.filter(opt => opt.group === 'Healing & Wellness').map(opt => (
                        <label key={opt.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRetreatOptions.includes(opt.id)}
                            onChange={handleTourFieldChange(() => handleRetreatOptionToggle(opt.id))}
                            className="accent-green-600 w-5 h-5"
                          />
                          <span className="text-base mbg-text-primary">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Nature & Adventure */}
                  <div>
                    <h3 className="text-lg font-semibold mbg-text-accent mb-3">Nature & Adventure</h3>
                    <div className="space-y-2">
                      {RETREAT_OPTIONS.filter(opt => opt.group === 'Nature & Adventure').map(opt => (
                        <label key={opt.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRetreatOptions.includes(opt.id)}
                            onChange={handleTourFieldChange(() => handleRetreatOptionToggle(opt.id))}
                            className="accent-green-600 w-5 h-5"
                          />
                          <span className="text-base mbg-text-primary">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Contact Info or Thank You Message */}
          {inquiryComplete ? (
            <Card className="mbg-card flex flex-col items-center justify-center p-10">
              <svg className="w-16 h-16 mb-4 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1010 0 5 5 0 00-10 0z" />
              </svg>
              <h2 className="text-2xl font-extrabold text-green-700 mb-2 text-center drop-shadow-lg">Thank You for Your Inquiry!</h2>
              <p className="text-lg text-green-900 mb-4 text-center">We appreciate your interest in our Retreat Tours.<br/>Our team will review your request and follow up soon with a custom itinerary.</p>
            </Card>
          ) : (
            <Card className="mbg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-light mbg-text-primary">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Full Name *</label>
                  <Input
                    value={contactInfo.name}
                    onChange={e => setContactInfo((prev) => ({ ...prev, name: e.target.value }))}
                    className="mbg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={e => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                    className="mbg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mbg-text-secondary mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={e => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mbg-input"
                  />
                </div>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 text-lg font-medium rounded-lg shadow-lg mt-4 px-8 animate-pulse hover:scale-105 transition-transform"
                  style={{ width: 'auto', minWidth: 180, alignSelf: 'center', letterSpacing: 1 }}
                  onClick={handleRequestTourInfo}
                  type="button"
                >
                  Submit Inquiry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add spacing between Contact Info and Testimonials */}
        <div style={{height: '2.5rem'}}></div>

        {/* Testimonials Section (from plan-retreat) */}
        <div className="mbg-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="mbg-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mbg-text-primary mb-4">
                Retreat Testimonials
              </h2>
              <p className="text-lg mbg-text-primary max-w-2xl mx-auto font-medium">
                Hear from guests who have experienced the transformative power of our healing retreats
              </p>
            </div>
            {/* Testimonials Slideshow */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div 
                className="mbg-card min-h-[300px] flex items-center transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing"
              >
                <div className="w-full">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>View Retreat Experience</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
            </div>
            <div className="text-center mt-8">
              <p className="text-lg mbg-text-primary mb-6 font-bold">
                Ready to create your own transformative retreat experience?
              </p>
            </div>
          </div>
          {/* Sophisticated Media Popup Modal */}
          {testimonials[currentTestimonialIndex].hasMediaPopup && isMediaPopupOpen && (
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
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="group relative overflow-hidden rounded-xl cursor-pointer">
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
                    </div>
                    <div className="group relative overflow-hidden rounded-xl cursor-pointer">
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
                    </div>
                    <div className="group relative overflow-hidden rounded-xl cursor-pointer">
                      <img 
                        src="/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png" 
                        alt="Strawberry Hills"
                        className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                        Strawberry Hills
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl cursor-pointer">
                      <img 
                        src="/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png" 
                        alt="Bath Fountain"
                        className="w-full aspect-[4/3] object-cover border-3 border-green-400 hover:border-green-300 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm font-medium">
                        Bath Fountain
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl md:col-span-2 cursor-pointer">
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
                    </div>
                  </div>
                  {/* Videos Section */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video Highlights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          src="/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png" 
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
            </div>
          )}
        </div>
      </div>

      {/* Thank You Popup rendered at the root level for proper overlay */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-100 via-white to-emerald-100 rounded-3xl shadow-2xl max-w-lg w-full p-10 relative animate-fade-in flex flex-col items-center border-4 border-green-300">
            <svg className="w-20 h-20 mb-4 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1010 0 5 5 0 00-10 0z" />
            </svg>
            <h2 className="text-3xl font-extrabold text-green-700 mb-2 text-center drop-shadow-lg">Thank You for Your Inquiry!</h2>
            <p className="text-lg text-green-900 mb-6 text-center">We appreciate your interest in our Retreat Tours.<br/>Our team will review your request and follow up soon with a custom itinerary.</p>
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold"
              onClick={() => {
                setShowThankYou(false);
                setShowNewsletterPrompt(true);
              }}
            >Continue</Button>
          </div>
        </div>
      )}

      {/* Newsletter Prompt removed: membership does not require newsletter signup anymore */}

      {/* Password Setup Modal for new members */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-100 via-white to-emerald-100 rounded-3xl shadow-2xl max-w-lg w-full p-10 relative animate-fade-in flex flex-col items-center border-4 border-green-300">
            <h2 className="text-2xl font-extrabold text-green-700 mb-2 text-center drop-shadow-lg">Set Your Password</h2>
            <p className="text-lg text-green-900 mb-4 text-center">Welcome! Please choose a password to complete your membership setup.</p>
            <input
              type="password"
              className="mbg-input w-full mb-3"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
            />
            <input
              type="password"
              className="mbg-input w-full mb-3"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              minLength={6}
            />
            {passwordError && <div className="text-red-600 mb-2 text-sm">{passwordError}</div>}
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold mb-2"
              onClick={() => {
                if (!password || !confirmPassword) {
                  setPasswordError('Please enter and confirm your password.');
                  return;
                }
                if (password.length < 6) {
                  setPasswordError('Password must be at least 6 characters.');
                  return;
                }
                if (password !== confirmPassword) {
                  setPasswordError('Passwords do not match.');
                  return;
                }
                setPasswordError('');
                // TODO: Integrate with backend to save password for user
                setShowPasswordModal(false);
                alert('Password set! Your membership is now complete.');
              }}
            >Set Password</Button>
            <Button
              className="bg-gray-300 text-green-800 px-8 py-3 rounded-lg shadow-lg text-lg font-semibold"
              onClick={() => setShowPasswordModal(false)}
            >Skip for Now</Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

// For compatibility with both import styles

export default RetreatToursPage;

