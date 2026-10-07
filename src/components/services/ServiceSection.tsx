import React from 'react';
import ServiceCardWeb from './ServiceCardWeb';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  practitionerName: string;
}

interface ServiceSectionProps {
  title: string;
  description?: string;
  services: Service[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ 
  title, 
  description, 
  services 
}) => {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">{title}</h2>
        {description && (
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {services.map((service) => (
            <ServiceCardWeb
              key={service.id}
              title={service.title}
              description={service.description}
              duration={service.duration}
              price={service.price}
              image={service.image}
              practitionerName={service.practitionerName}
              serviceId={service.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
