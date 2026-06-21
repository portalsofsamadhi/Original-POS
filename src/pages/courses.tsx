import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  Users, 
  Clock as _Clock, 
  CheckCircle, 
  Star, 
  Video, 
  Phone, 
  BookOpen, 
  Heart, 
  Brain, 
  Leaf, 
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap,
  X,
  Mail,
  User
} from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';
import PayPalPayment from '../components/payment/PayPalPayment';

const CoursesPage: React.FC = () => {
  const _navigate = useNavigate();
  const [selectedModule, _setSelectedModule] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const courseModules = [
    {
      week: 1,
      title: "Pattern Recognition & Awareness",
      subtitle: "Identifying What No Longer Serves You",
  image: "/images/erastus-mccart-i6UdBLu_wwk-unsplash.webp",
      liveSession: "Pattern Mapping Workshop",
      selfStudy: "Daily Awareness Journaling",
      botanicalSupport: "Clarity Blend Tea",
      spiritualPractice: "Mindful Observation Meditation",
      outcomes: [
        "Identify 3-5 core limiting patterns",
        "Understand pattern triggers and cycles",
        "Create personal pattern awareness map"
      ]
    },
    {
      week: 2,
      title: "Emotional Pattern Transformation",
      subtitle: "Rewiring Emotional Responses",
  image: "/images/ashley-byrd-uUOQlm3Idv0-unsplash.webp",
      liveSession: "Emotional Alchemy Session",
      selfStudy: "Emotion Regulation Toolkit",
      botanicalSupport: "Heart-Calming Formula",
      spiritualPractice: "Emotional Release Ceremony",
      outcomes: [
        "Master emotional regulation techniques",
        "Transform reactive patterns into responsive ones",
        "Build emotional resilience foundation"
      ]
    },
    {
      week: 3,
      title: "Nutritional Realignment",
      subtitle: "Food as Medicine & Transformation",
  image: "/images/anirudh-chavali-JpeV5C_3M3Y-unsplash.webp",
      liveSession: "Ital Nutrition Masterclass",
      selfStudy: "Meal Planning & Shopping Guide",
      botanicalSupport: "Digestive Healing Tincture",
      spiritualPractice: "Gratitude & Blessing Rituals",
      outcomes: [
        "Create personalized meal transition plan",
        "Locate optimal food sources in your area",
        "Establish sustainable eating patterns"
      ]
    },
    {
      week: 4,
      title: "Spiritual Alignment & Mindfulness",
      subtitle: "Connecting to Your Higher Purpose",
  image: "/images/david-courbit-M8xxVih_V_U-unsplash.webp",
      liveSession: "Ancestral Wisdom Connection",
      selfStudy: "Daily Spiritual Practices",
      botanicalSupport: "Spiritual Clarity Blend",
      spiritualPractice: "Vision Quest Meditation",
      outcomes: [
        "Develop consistent meditation practice",
        "Connect with ancestral guidance",
        "Clarify life purpose and direction"
      ]
    },
    {
      week: 5,
      title: "Habit Architecture & Implementation",
      subtitle: "Building Your New Reality",
  image: "/images/daniel-sinoca-UjXGaJHH2jE-unsplash.webp",
      liveSession: "Habit Stacking Workshop",
      selfStudy: "Implementation Tracking System",
      botanicalSupport: "Motivation & Focus Formula",
      spiritualPractice: "Manifestation Ceremonies",
      outcomes: [
        "Design foolproof habit replacement system",
        "Create accountability structures",
        "Establish momentum for lasting change"
      ]
    },
    {
      week: 6,
      title: "Integration & Mastery",
      subtitle: "Sustaining Your Transformation",
  image: "/images/heather-green-SzDrE3_msOs-unsplash.webp",
      liveSession: "Mastery Integration Session",
      selfStudy: "Lifetime Maintenance Plan",
      botanicalSupport: "Vitality & Strength Blend",
      spiritualPractice: "Commitment Ceremony",
      outcomes: [
        "Master relapse prevention strategies",
        "Create long-term success blueprint",
        "Celebrate transformation achievements"
      ]
    }
  ];

  const courseFeatures = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Live Weekly Sessions",
      description: "90-minute interactive workshops with Dr. Feq'ad and Mesq'al"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "1-on-1 Coaching Calls",
      description: "Three 60-minute private sessions for personalized guidance"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Comprehensive Workbooks",
      description: "Detailed guides, exercises, and tracking tools for each module"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Botanical Support Kit",
      description: "Custom herbal formulations to support your transformation"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Spiritual Practice Library",
      description: "Traditional ceremonies and meditations for deep healing"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Success Tracking System",
      description: "Measurable milestones and progress tracking tools"
    }  ];

  const handleEnrollNow = () => {
    setShowPaymentModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnrollmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = (details: unknown) => {
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    
    // Here you would typically save the enrollment to your backend
    console.log('Payment successful:', details);
    console.log('Enrollment data:', enrollmentData);
    
    // Send confirmation email, create user account, etc.
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      // Optionally navigate to a success page or show success message
      alert('Enrollment successful! You will receive a confirmation email with course details and access instructions.');
    }, 3000);
  };

  const handlePaymentError = (error: unknown) => {
    setIsProcessingPayment(false);
    console.error('Payment error:', error);
    alert('Payment failed. Please try again or contact support.');
  };

  const handlePaymentCancel = () => {
    setIsProcessingPayment(false);
  };

  const isFormValid = enrollmentData.name && enrollmentData.email && enrollmentData.phone && enrollmentData.startDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">      <SEO 
        title={PAGE_SEO["/courses"].title}
        description={PAGE_SEO["/courses"].description}
        image={PAGE_SEO["/courses"].image}
        imageAlt={PAGE_SEO["/courses"].imageAlt}
        imageWidth={1200}
        imageHeight={630}
        url="/courses"
        keywords={[
          'global transformation program',
          'virtual wellness courses worldwide',
          'online behavioral change program',
          'international transformation course',
          'global traditional wisdom courses',
          'worldwide botanical healing program',
          'virtual behavior science training',
          'online personal transformation',
          'international wellness education',
          'global holistic life coaching',
          'worldwide transformation course',
          'virtual wellness transformation',
          'online limiting patterns program',
          'international spiritual courses',
          'global wellness certification'
        ]}
        schemaType="Course"
        locale="en_US"
        siteName="Portals of Samadhi"
      />

      {/* Hero Section */}
      <div className="relative bg-white text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.webp')"
          }}
        ></div>
        {/* Dark Overlay with Chrome Finish */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-gray-900/60 to-black/65 backdrop-blur-[1px]" 
             style={{
               background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(30,30,30,0.65) 25%, rgba(0,0,0,0.6) 50%, rgba(20,20,20,0.7) 75%, rgba(0,0,0,0.65) 100%)',
               boxShadow: 'inset 0 0 50px rgba(0,0,0,0.25)'
             }}>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-6 bg-green-600 text-white px-4 py-2 text-sm">
              Premium Transformation Program
            </Badge>            <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 text-white">
              Ralign
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Program
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-white max-w-4xl mx-auto mb-8">
              A sophisticated 6-week transformation program that identifies patterns no longer serving you 
              and provides concrete tools to replace them with life-enhancing habits.
            </p>
            
            <div className="flex justify-center space-x-8 text-sm font-light mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-300" />
                6 Weeks Intensive
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-300" />
                Limited to 12 Students
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-green-300" />
                20+ Years Expertise
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleEnrollNow}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Enroll Now - $2,997
              </Button>
              <p className="text-green-300 text-sm">
                Next cohort starts January 6th, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* What You'll Transform */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            What You'll Transform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Emotional Patterns</h3>
              <p className="text-gray-600 text-sm">Transform reactive emotions into conscious responses</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nutritional Habits</h3>
              <p className="text-gray-600 text-sm">Realign eating patterns with your highest good</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mindfulness Practices</h3>
              <p className="text-gray-600 text-sm">Develop consistent spiritual and mental clarity</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Life Alignment</h3>
              <p className="text-gray-600 text-sm">Create harmony between values and daily actions</p>
            </div>
          </div>
        </div>

        {/* 6-Week Curriculum */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
            6-Week Transformation Journey
          </h2>
          
          <div className="space-y-8">
            {courseModules.map((module, index) => (
              <Card 
                key={module.week} 
                className={`border-0 shadow-lg transition-all duration-300 ${
                  selectedModule === index ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-auto">
                      <img 
                        src={module.image} 
                        alt={module.title}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 text-white px-3 py-1">
                          Week {module.week}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="lg:col-span-2 p-8">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {module.title}
                        </h3>
                        <p className="text-green-600 font-medium mb-4">
                          {module.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Video className="w-4 h-4 mr-2 text-green-600" />
                            Live Session
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">{module.liveSession}</p>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                            Self-Study
                          </h4>
                          <p className="text-gray-600 text-sm">{module.selfStudy}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Leaf className="w-4 h-4 mr-2 text-green-600" />
                            Botanical Support
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">{module.botanicalSupport}</p>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                            Spiritual Practice
                          </h4>
                          <p className="text-gray-600 text-sm">{module.spiritualPractice}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                          Week {module.week} Outcomes
                        </h4>
                        <ul className="space-y-2">
                          {module.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Course Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
            Premium Course Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing & Enrollment */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-light">
                Transform Your Life Today
              </CardTitle>
              <p className="text-green-100 mt-2">
                Limited to 12 students per cohort for maximum personal attention
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">$2,997</div>
                <p className="text-gray-600">Complete 6-week transformation program</p>
                <p className="text-sm text-green-600 mt-2">Payment plans available</p>
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">6 live weekly sessions (90 min each)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">3 private 1-on-1 coaching calls (60 min each)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Complete botanical support kit ($400 value)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Comprehensive workbooks and tracking tools</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Lifetime access to course materials</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">90-day transformation guarantee</span>
                </div>
              </div>

              <Button 
                onClick={handleEnrollNow}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Secure Your Spot - Enroll Now
              </Button>
              
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-green-600" />
                  Instant Access
                </div>
              </div>            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Program Enrollment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Enrollment Successful!</h4>
                  <p className="text-gray-600 mb-4">
                    Welcome to Ralign. You'll receive a confirmation email with program details and access instructions.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ralign</h4>
                    <p className="text-gray-600 mb-4">6-Week Transformation Program</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Program Fee:</span>
                        <span className="text-2xl font-bold text-green-600">$2,997</span>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={enrollmentData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={enrollmentData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={enrollmentData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Start Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <select
                          name="startDate"
                          value={enrollmentData.startDate}
                          onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select start date</option>
                          <option value="2024-02-05">February 5, 2024</option>
                          <option value="2024-03-04">March 4, 2024</option>
                          <option value="2024-04-01">April 1, 2024</option>
                          <option value="2024-05-06">May 6, 2024</option>
                        </select>
                      </div>
                    </div>
                  </form>

                  {isFormValid && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Complete your enrollment by processing payment below:
                      </p>
                      <PayPalPayment
                        amount={2997}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onCancel={handlePaymentCancel}
                        disabled={isProcessingPayment}
                      />
                    </div>
                  )}

                  {!isFormValid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Please complete all required fields to proceed with payment.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
