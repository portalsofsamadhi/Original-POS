import { useState, useEffect } from 'react';
import { Headphones, X } from 'lucide-react';

const AccessibilityReader = () => {
  const [isActive, setIsActive] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  // Initialize speech synthesis
  useEffect(() => {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsAudioInitialized(true);
    }
  }, []);

  // Function to start/stop screen reader
  const toggleScreenReader = () => {
    if (isActive) {
      // Stop the screen reader
      window.speechSynthesis.cancel();
      setIsActive(false);
    } else {
      // Start the screen reader
      setIsActive(true);
      // Initial announcement to indicate the screen reader is active
      speak("Screen reader activated. Click on any text to have it read aloud.");
    }
  };

  // Function to speak text
  const speak = (text: string) => {
    if (!isAudioInitialized) return;
    
    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Set up event listeners for text selection
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      if (!isActive) return;
      
      // Find the closest text element
      const element = e.target as HTMLElement;
      if (element) {
        // Get the text content
        let textToRead = element.innerText || element.textContent || '';
        
        // Clean up the text (remove excess whitespace)
        textToRead = textToRead.trim().replace(/\s+/g, ' ');
        
        if (textToRead) {
          setSelectedText(textToRead);
          speak(textToRead);
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isActive]);

  return (
    <div className="fixed left-4 bottom-8 z-50">
      {isActive && (        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg shadow-lg max-w-xs">
          <button 
            onClick={() => setIsActive(false)}
            className="absolute top-1 right-1 p-1 text-white hover:bg-green-700 rounded-full"
            aria-label="Close screen reader"
          >
            <X size={16} />
          </button>
          <h3 className="font-medium mb-1">Screen Reader Active</h3>
          <p className="text-sm mb-2">Click on any text to hear it read aloud.</p>
          {selectedText && (
            <div className="mt-2 p-2 bg-green-700 rounded text-sm">
              <p>Last read: "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</p>
            </div>
          )}
        </div>
      )}      <button
        onClick={toggleScreenReader}
        className={`p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 ${
          isActive ? 'bg-green-700 text-white' : 'bg-white text-green-600'
        }`}
        aria-label={isActive ? 'Disable screen reader' : 'Enable screen reader'}
        title="Screen Reader"
      >
        <Headphones size={24} />
      </button>
    </div>
  );
};

export default AccessibilityReader;
