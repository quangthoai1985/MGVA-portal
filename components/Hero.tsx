import React from 'react';
import { Carousel } from './ui/Carousel';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1587654780291-39c940483706?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1545558014-a15f9893540a?auto=format&fit=crop&q=80&w=2000"
];

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] md:h-screen max-h-[800px] bg-gray-100">
      <Carousel images={HERO_IMAGES} autoPlayInterval={6000} />
      
      {/* Optional: subtle gradient at bottom for smooth transition to content */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-50 to-transparent pointer-events-none" />
    </div>
  );
};