// src/components/Logo.tsx

import React from 'react';

interface LogoProps {
  href?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ href = '/', className = '' }) => {
  // Define all styles using Tailwind utility classes
  const tailwindClasses = `
    text-blue-900      // A deep blue from Tailwind's palette
    hover:text-black   // On hover, text becomes black
    no-underline       // Removes the underline
    font-bold          // Makes the text bold
    text-2xl           // Sets a larger font size (e.g., 1.5rem)
    transition-colors  // Adds a smooth transition effect
    duration-200       // Sets the transition duration
  `;

  // Combine utility classes with any custom classes passed in
  const combinedClassName = `${tailwindClasses} ${className}`.trim();

  return (
    <a href={href} className={combinedClassName}>
      DataProxy
    </a>
  );
};

export default Logo;