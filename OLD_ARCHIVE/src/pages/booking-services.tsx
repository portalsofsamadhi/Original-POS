import ServiceSection from '../components/services/ServiceSection';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';

const BookingServicesPage = () => {
  const _servicesSchema = {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: "Energy Healing Session",
        provider: {
          '@type': 'Person',
          name: "Feq'ad Wolde",
        },
        description: "A personalized healing session to restore balance and vitality to your energy field.",
        price: "150 USD",
        duration: "PT90M"
      },
      {
        '@type': 'Service',
        position: 2,
        name: "Administrative Support Consultation",
        provider: {
          '@type': 'Person',
          name: "Mesq'al Kebra",
        },
        description: "A personalized consultation to assess your administrative needs.",
        price: "45 USD",
        duration: "PT30M"
      }
    ]
  };

  const feqadServices = [
    {
      id: "feqad-energy-healing",
      title: "Energy Healing Session",
      description: "A personalized healing session to restore balance and vitality to your energy field, addressing physical, emotional, and spiritual blockages.",
      duration: "90 minutes",
      price: 150,
      image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&q=80",
      practitionerName: "Feq'ad Wolde"
    },
    {
      id: "feqad-spiritual-counseling",
      title: "Spiritual Counseling",
      description: "Compassionate guidance to help navigate life challenges from a spiritual perspective, offering clarity and insight for your journey.",
      duration: "60 minutes",
      price: 120,
      image: "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80",
      practitionerName: "Feq'ad Wolde"
    },
    {
      id: "feqad-chakra-alignment",
      title: "Chakra Alignment & Balancing",
      description: "Comprehensive assessment and alignment of your seven main energy centers to harmonize your entire energy system and promote wellbeing.",
      duration: "75 minutes",
      price: 135,
      image: "https://images.unsplash.com/photo-1566296314736-e1e6febc252a?w=600&q=80",
      practitionerName: "Feq'ad Wolde"
    }
  ];  const mesqalServices = [
    {
      id: "mesqal-administrative-consultation",
      title: "Administrative Support Consultation",
      description: "A personalized consultation to assess your administrative needs and develop a tailored support strategy for your practice or business.",
      duration: "30 minutes",
      price: 45,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
      practitionerName: "Mesq'al Kebra"
    },
    {
      id: "mesqal-virtual-assistant-package",
      title: "Virtual Assistant Package Consultation",
      description: "Discuss ongoing administrative assistance with a dedicated monthly package of support hours tailored to your specific needs.",
      duration: "45 minutes",
      price: 65,
      image: "https://images.unsplash.com/photo-1554252116-6d7322ed6eb3?w=600&q=80",
      practitionerName: "Mesq'al Kebra"    },
    {
      id: "mesqal-sacred-ceremony",
      title: "Sacred Ceremony Facilitation",
      description: "Experience a sacred ceremony tailored to your needs, whether for healing, celebration, transition, or spiritual connection.",
      duration: "120 minutes",
      price: 200,
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80",
      practitionerName: "Mesq'al Kebra"
    }
  ];
  return (
    <>
      <SEO
        title={PAGE_SEO["/booking-services"].title}
        description={PAGE_SEO["/booking-services"].description}
        image={PAGE_SEO["/booking-services"].image}
        url="/booking-services"
        imageAlt={PAGE_SEO["/booking-services"].imageAlt}
        keywords={[
          'book healing sessions online',
          'schedule virtual assistant services',
          'online booking holistic healing',
          'book jamaican healer appointment',
          'virtual healing session booking',
          'schedule wellness consultation',
          'book spiritual guidance session',
          'online appointment holistic services',
          'secure booking healing services',
          'schedule virtual wellness session',
          'book energy healing online',
          'virtual assistant booking platform',
          'online scheduling wellness services',
          'book traditional healing session',
          'virtual consultation booking',
          'schedule healing appointment online',
          'book wellness services secure',
          'online booking spiritual guidance',
          'schedule virtual healing session',
          'book holistic practitioner online'
        ]}
        schemaType="WebPage"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Book Services - Portals of Samadhi',
          description: 'Secure online booking platform for holistic healing sessions and virtual assistant services.',
          provider: {
            '@type': 'Organization',
            name: 'Portals of Samadhi'
          },
          mainEntity: {
            '@type': 'Service',
            name: 'Online Booking Services',
            description: 'Secure platform for booking healing sessions and virtual assistant services with instant confirmation.',
            offers: [
              {
                '@type': 'Offer',
                name: 'Healing Session Booking',
                description: 'Book authentic traditional healing sessions with Dr. Feqad Wolde'
              },
              {
                '@type': 'Offer',
                name: 'Virtual Assistant Services Booking',
                description: 'Schedule professional virtual assistant services with Mesqal Kebra'
              }
            ]
          }
        }}
      />
      <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="py-12 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Our Services</h1>
            <p className="mt-4 text-green-100 text-lg">
              Browse our offerings and book your session today using our new integrated booking system.
            </p>
          </div>
        </div>
      </div>

      <ServiceSection 
        title="Feq'ad Wolde's Services" 
        description="Transformative energy healing and spiritual guidance services to support your wellbeing journey."
        services={feqadServices}
      />

      <div className="bg-gray-100 py-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">How Our Booking Process Works</h2>
            <p className="text-gray-600 mb-6">
              Our new streamlined booking process gives you flexibility to choose what works best for you. Start with a free consultation to discuss your needs, or book a full service package directly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Choose Your Option</h3>
                <p className="text-gray-600 text-sm">Start with a free consultation or book a full service package directly.</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Schedule Your Session</h3>
                <p className="text-gray-600 text-sm">Select your preferred date and time, and provide your contact information.</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Confirmation</h3>
                <p className="text-gray-600 text-sm">For consultations, receive email confirmation. For packages, complete secure payment and get instant confirmation.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">🆓 Start with a Free Consultation</h2>
            <p className="mb-6 text-purple-100">
              Not sure which service is right for you? Book a complimentary consultation with our practitioners to discuss your needs and find the perfect fit. No payment required - we'll reach out to schedule your session.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">✨ What You Get:</h3>
                <ul className="text-sm text-purple-100 space-y-1">
                  <li>• 15-20 minute phone or video consultation</li>
                  <li>• Personalized service recommendations</li>
                  <li>• Answers to all your questions</li>
                  <li>• No obligation or pressure</li>
                </ul>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Perfect For:</h3>
                <ul className="text-sm text-purple-100 space-y-1">
                  <li>• First-time clients</li>
                  <li>• Those exploring healing options</li>
                  <li>• Questions about our approach</li>
                  <li>• Custom service needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>      <ServiceSection 
        title="Mesq'al Kebra's Services" 
        description="Administrative support services and sacred ceremonies for spiritual practitioners, healing professionals, and wellness entrepreneurs."
        services={mesqalServices}
      />
    </div>
    </>
  );
};

export default BookingServicesPage;
