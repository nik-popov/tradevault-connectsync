import React from 'react';
import { Link, LinkProps, HStack } from '@chakra-ui/react';
import { Layers } from 'react-feather';

// Props interface remains the same, which is great.
interface LogoProps extends LinkProps {}

// By destructuring, we make it explicit that `href` is a prop we are aware of.
// We provide a default value of "/" for it.
// All other props are collected into the `...rest` object.
const Logo: React.FC<LogoProps> = ({ href = "/", ...rest }) => {
  return (
    <Link
      // We now explicitly use the `href` variable.
      href={href}
      // --- Style Props ---
      color="orange.400"
      fontWeight="bold"
      fontSize="2xl"
      transition="color 0.2s ease-in-out"
      _hover={{
        textDecoration: 'none',
        color: 'orange.200',
      }}
      // Spread the rest of the props. This is cleaner because we know
      // `href` is not in this object, avoiding any potential confusion.
      {...rest}
    >
      <HStack spacing={1} align="center">
        <Layers size={28} strokeWidth={2.5} />
        <span>
          tradevault
        </span>
      </HStack>
    </Link>
  );
};

export default Logo;