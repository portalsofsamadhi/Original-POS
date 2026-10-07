import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Phone } from 'lucide-react';

interface DeviceSwitcherProps {
  isDevelopment?: boolean;
}

const DeviceSwitcher: React.FC<DeviceSwitcherProps> = ({ 
  isDevelopment = process.env.NODE_ENV === 'development' 
}) => {
  const [currentDevice, setCurrentDevice] = useState<string>('desktop');
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 170, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const devices = [
    {
      id: 'mobile-small',
      name: 'Mobile S',
      icon: Phone,
      width: '320px',
      height: '568px',
      description: 'iPhone SE, Small phones'
    },
    {
      id: 'mobile-large',
      name: 'Mobile L',
      icon: Smartphone,
      width: '375px',
      height: '812px',
      description: 'iPhone 12/13/14, Large phones'
    },
    {
      id: 'tablet',
      name: 'Tablet',
      icon: Tablet,
      width: '768px',
      height: '1024px',
      description: 'iPad, Android tablets'
    },
    {
      id: 'desktop',
      name: 'Desktop',
      icon: Monitor,
      width: '100%',
      height: '100%',
      description: 'Desktop & Laptop screens'
    }
  ];

  const switchDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    setCurrentDevice(deviceId);

    // Apply styles to the root element to simulate device viewport
    const root = document.documentElement;
    
    if (deviceId === 'desktop') {
      root.style.maxWidth = '';
      root.style.margin = '';
      root.style.boxShadow = '';
      root.style.backgroundColor = '';
      document.body.style.maxWidth = '';
      document.body.style.margin = '';
      document.body.style.boxShadow = '';
    } else {
      // Center the content and add device frame
      root.style.backgroundColor = '#f0f0f0';
      document.body.style.maxWidth = device.width;
      document.body.style.margin = '20px auto';
      document.body.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
      document.body.style.borderRadius = '12px';
      document.body.style.overflow = 'hidden';
      
      // Set viewport meta tag for mobile simulation
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          deviceId.includes('mobile') 
            ? 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            : 'width=device-width, initial-scale=1.0'
        );
      }
    }

    // Trigger resize event to update responsive layouts
    window.dispatchEvent(new Event('resize'));
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 160; // Account for switcher width
      const maxY = window.innerHeight - 200; // Account for switcher height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Auto-hide in production unless explicitly shown
  if (!isDevelopment && !window.location.search.includes('dev-tools=true')) {
    return null;
  }

  return (
    <div 
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: isDragging 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 4px 16px rgba(0, 0, 0, 0.2)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '11px',
        color: 'white',
        minWidth: '140px',
        maxWidth: '160px',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        transform: isVisible ? 'translateX(0)' : 'translateX(calc(100% - 30px))',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking toggle
        style={{
          position: 'absolute',
          left: '-24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.85)',
          border: 'none',
          borderRadius: '4px 0 0 4px',
          color: 'white',
          padding: '4px 3px',
          cursor: 'pointer',
          fontSize: '10px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        📱
      </button>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Drag handle header */}
        <div 
          className="drag-handle"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 4px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            cursor: 'grab',
            marginBottom: '2px',
          }}
          onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
          onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#4ade80',
          }}>
            📱 Devices
          </div>
          <div style={{
            fontSize: '8px',
            opacity: 0.6,
            color: '#888',
          }}>
            ⋮⋮
          </div>
        </div>

        {devices.map((device) => {
          const Icon = device.icon;
          const isActive = currentDevice === device.id;
          
          return (
            <button
              key={device.id}
              onClick={() => switchDevice(device.id)}
              onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 6px',
                background: isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? 'black' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <Icon size={12} />
              <div style={{ flex: 1 }}>
                <div>{device.name}</div>
                <div style={{
                  fontSize: '9px',
                  opacity: 0.7,
                  color: isActive ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'
                }}>
                  {device.width} × {device.height}
                </div>
              </div>
            </button>
          );
        })}

        <div style={{
          fontSize: '11px',
          textAlign: 'center',
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'rgba(255, 255, 255, 0.8)',
        }}>
          Current: <strong>{devices.find(d => d.id === currentDevice)?.description}</strong>
        </div>
      </div>
    </div>
  );
};

export default DeviceSwitcher;
