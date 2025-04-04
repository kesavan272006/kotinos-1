import React, { useState, useEffect } from 'react';
import SS1 from '../test/SS1.png';
import SS2 from '../test/SS2.png';
import SS3 from '../test/SS3.png';
import SS4 from '../test/SS4.png';

const slides = [
  {
    image: SS1,
    title: 'Share & Shine',
    description:
      'Post your thoughts, moments, and images to tell your story. Highlight your journey by marking key moments as achievements, helping you inspire others and showcase your success.',
  },
  {
    image: SS3,
    title: 'Expand Your Network',
    description: 'Discover new athletes, enthusiasts, and professionals who share your passion for sports. Build meaningful connections, grow your network, and collaborate within a vibrant community.',
  },
  {
    image: SS4,
    title: 'Connect & Converse',
    description: " Stay engaged with personal chats, collaborate in group discussions, or join vibrant community conversations. Build relationships, share ideas, and be part of a connected sports network.",
  },
  {
    image: SS2,
    title: 'Rio - Your Sports Companion',
    description: " Get instant advice and injury prevention tips with our AI-powered chatbot. Designed to address your sports-related queries, it's your trusted ally on the path to peak performance.",
  },
];

const CustomCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[80vw] h-[80vh] overflow-hidden mx-auto rounded-lg shadow-xl">
      {/* Slide container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[80vw] h-[80vh] relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-6 text-white pt-10">
              <h3 className="text-xl font-bold">{slide.title}</h3>
              <p className="text-sm md:px-40">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800/40 text-white rounded-full p-2 z-10"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800/40 text-white rounded-full p-2 z-10"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-white' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
