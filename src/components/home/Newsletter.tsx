import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { newsletterAPI } from "../../utils/newsletterAPI";
import "../../styles/mbg-aesthetics.css";

interface NewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

const Newsletter = ({
  title: _title = "Subscribe to our Newsletter",
  description = "Stay updated with our latest services, events, and spiritual insights.",
  buttonText = "Subscribe",
}: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Phone prompt removed
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    console.log("Newsletter subscription attempt for:", email);
    setIsLoading(true);
    
    try {
      console.log("Calling newsletterAPI.subscribe...");
      const result = await newsletterAPI.subscribe(email);
      console.log("Newsletter API result:", result);
      
      // Save member profile to localStorage
      const joinDate = new Date().toLocaleDateString();
      localStorage.setItem(
        "memberProfile",
        JSON.stringify({ email, joinDate })
      );
      setEmail("");
      setShowThankYou(true);
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our community. Check your inbox for updates.",
      });
      console.log("Newsletter subscription successful!");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, we couldn't subscribe you at this time. Please try again later.";
      console.log("Error message to show:", errorMessage);
      
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Show alert as backup in case toast doesn't work
      alert(`Subscription failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      console.log("Newsletter subscription attempt completed");
    }
  };

  // Phone prompt logic removed

  return (
    <section className="mbg-section-large mbg-bg-white py-24" style={{ marginTop: '-4rem' }}>
      <div className="mbg-container scroll-stagger">
        {/* Green Keyword Title - Larger */}
        <div className="mbg-keyword-title text-center mb-16 scroll-fade-in newsletter-title-mobile-spacing" style={{ fontSize: '1.5rem', letterSpacing: '0.2em' }}>Newsletter</div>
        <style>{`
          @media (max-width: 1023px) {
            .newsletter-title-mobile-spacing {
              margin-top: 2.5rem !important;
            }
          }
        `}</style>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Section */}
          <div className="lg:col-span-7 space-y-12 scroll-slide-left">
            <div className="space-y-8">
              <h2 className="mbg-hero-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: '1.1' }}>
                JOIN THE
                <br />
                <span className="mbg-text-primary" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4.5rem)' }}>PORTALS OF SAMADHI</span>
                <br />
                <em className="mbg-subtitle-italic" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>collective movement</em>
              </h2>
              <p className="mbg-body-text max-w-2xl" style={{ fontSize: '1.25rem', lineHeight: '1.7', color: 'var(--mbg-dark-gray)' }}>
                {description} Join our community of conscious beings dedicated to holistic healing, spiritual growth, and transformative experiences.
              </p>
            </div>
          </div>
          {/* Right Section */}
          <div className="lg:col-span-5 scroll-scale">
            <div className="mbg-card p-8">
            <form
              className="space-y-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6">
                <p className="mbg-small-caps" style={{ fontSize: '1rem', letterSpacing: '0.15em' }}>
                  SUBSCRIBE FOR UPDATES
                </p>
                <Input
                  className="mbg-input text-lg py-4 px-6"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  style={{ fontSize: '1.1rem', height: '3.5rem' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="mbg-btn mbg-btn-primary text-lg py-4 px-8 w-full"
                style={{ fontSize: '1.1rem', height: '3.5rem' }}
              >
                {isLoading ? "Subscribing..." : buttonText}
              </button>
            </form>
            <p className="mbg-small-text mt-6" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
              By subscribing, you agree to our terms and privacy policy.
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* Thank You Popup rendered at the root level for proper overlay */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-100 via-white to-emerald-100 rounded-3xl shadow-2xl max-w-lg w-full p-10 relative animate-fade-in flex flex-col items-center border-4 border-green-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold"
              onClick={() => setShowThankYou(false)}
              aria-label="Close Thank You"
            >×</button>
            <svg className="w-20 h-20 mb-4 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1010 0 5 5 0 00-10 0z" />
            </svg>
            <h2 className="text-3xl font-extrabold text-green-700 mb-2 text-center drop-shadow-lg">Thank You for Subscribing!</h2>
            <p className="text-lg text-green-900 mb-4 text-center">You have joined the Portals of Samadhi newsletter.<br/>Check your inbox for updates and inspiration!</p>
            <div className="mt-4 text-center">
              <Button
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold"
                onClick={() => setShowThankYou(false)}
              >Close</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Newsletter;
