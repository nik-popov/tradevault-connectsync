import React from 'react';
// Import HStack for layout and Link/LinkProps for the component
import { Link, LinkProps, HStack } from '@chakra-ui/react';

// 1. Import the 'Layers' icon directly from react-feather
import { Layers } from 'react-feather';

// We can extend Chakra's own LinkProps to make our component highly flexible
// and accept all standard Link attributes (like isExternal, etc.).
interface LogoProps extends LinkProps {}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <Link
      href="/" // Default link destination
      // --- Style Props ---
      color="orange.400"         // This color will be inherited by the icon and text
      fontWeight="bold"        // font-bold
      fontSize="2xl"           // text-2xl
      transition="color 0.2s ease-in-out" // Smooth transition
      
      // The hover state applies to the entire link, changing both icon and text color
      _hover={{
        textDecoration: 'none',  // no-underline on hover
        color: 'orange.200',          // hover:color
      }}
      
      // Spread any other props passed to Logo (like a custom href, onClick, etc.)
      {...props}
    >
      <HStack spacing={3} align="center">
        {/* 2. Replace the FontAwesomeIcon with the Layers component */}
        {/*    react-feather icons are simple components. We can pass size and strokeWidth. */}
        <Layers size={28} strokeWidth={2.5} />
        
        {/* The text of the logo */}
        <span>
          DATAPROXY
        </span>
      </HStack>
    </Link>
  );
};

export default Logo;