import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Page Not Found | Samadhi Productions"
        description="The page you are looking for does not exist or has been moved."
        url="/404"
        noindex
        nofollow
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-samadhi-black text-samadhi-cream">
        <h1 className="text-6xl font-bold mb-4 text-[#E8B4A3]">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-6 text-lg text-samadhi-cream/70">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#C3998F] text-samadhi-black rounded-lg hover:bg-[#E8B4A3] transition-colors duration-300"
        >
          Return Home
        </button>
      </div>
    </>
  );
};

export default NotFoundPage;