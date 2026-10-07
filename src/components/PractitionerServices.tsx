import React from "react";

interface PractitionerServicesProps {
  practitionerName: string;
}

const PractitionerServices: React.FC<PractitionerServicesProps> = ({ 
  practitionerName 
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{practitionerName}'s Services</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example service cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Healing Session</h3>
          <p className="text-gray-600 mb-4">A comprehensive healing session tailored to your specific needs.</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Book Now
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Wellness Consultation</h3>
          <p className="text-gray-600 mb-4">Personalized wellness guidance to enhance your overall well-being.</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Book Now
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Energy Alignment</h3>
          <p className="text-gray-600 mb-4">Realign your energy fields for improved spiritual and physical balance.</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PractitionerServices;
