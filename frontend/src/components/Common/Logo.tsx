// src/components/Logo.tsx

import React from 'react';
import { Link, LinkProps } from '@chakra-ui/react'; // Import Link and its props type

// We can extend Chakra's own LinkProps to make our component highly flexible
// and accept all standard Link attributes (like isExternal, etc.).
interface LogoProps extends LinkProps {}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <Link
      href="/" // Default link destination
      // --- Style Props ---
      color="orange.400"         // Deep blue from Chakra's theme (or "orange.900")
      fontWeight="bold"        // font-bold
      fontSize="2xl"           // text-2xl
      transition="color 0.2s ease-in-out" // Smooth transition
      
      // Chakra's syntax for hover, focus, and other pseudo-states
      _hover={{
        textDecoration: 'none',  // no-underline on hover
        color: 'orange.200',          // hover:text-black
      }}
      
      // Spread any other props passed to Logo (like a custom href, onClick, etc.)
      {...props}
    >
      DATAPROXY
    </Link>
  );
};

export default Logo;