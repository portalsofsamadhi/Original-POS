# Instructions for Manual Implementation

Here are the changes that need to be made to complete the requested tasks:

## 1. AboutUsSection.tsx Changes

1. Make sure the file imports `useState` and `BiographyDialog`:
```tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import BiographyDialog from "./BiographyDialog";
```

2. Add a state variable at the top of the component:
```tsx
const AboutUsSection: React.FC<AboutUsSectionProps> = ({ showOnlyApproach, showOnlyAbout }) => {
  const [isOpen, setIsOpen] = useState(false);
```

3. Find all "Learn More About Us" buttons and update them to open the dialog:
```tsx
<Button 
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md"
  onClick={() => setIsOpen(true)}
>
  Learn More About Us
</Button>
```

4. Add the BiographyDialog component at the end of both return statements (showOnlyAbout section and the default section):
```tsx
<BiographyDialog open={isOpen} onOpenChange={setIsOpen} />
```

## 2. Mesq'al's Services in booking-services.tsx

1. Update the first two Mesq'al services to have prices instead of being free:
```tsx
const mesqalServices = [
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
    practitionerName: "Mesq'al Kebra"
  },
  // ...
```

## 3. The BiographyDialog component has already been created

The BiographyDialog component has already been created with:
- Biographies for both Feq'ad and Mesq'al
- A section about their collective journey
- A button that redirects to the booking page
- Properly styled content with a scrollable area

These changes will satisfy all requested requirements:
1. The "Learn More About Us" button will open a popup with biographies
2. The content is different from the About section
3. The popup has a "Book a Service" button
4. Mesq'al's first two services have prices and durations set
