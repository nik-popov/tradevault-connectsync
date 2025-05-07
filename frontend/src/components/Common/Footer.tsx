import {
    Box,
    Flex,
    Text,
    Link,
    Icon,
    VStack,
  } from "@chakra-ui/react";
  import { FiPhone, FiMail, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";
  
  const Footer = () => {
    const textColor = "gray.800";
    const hoverColor = "blue.600";
  
    return (
      <Box bg="white" py={3} px={4} boxShadow="sm" w="100%">
        <Flex
          maxW="1200px"
          mx="auto"
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "center" }}
          justify="space-between"
          gap={{ base: 4, md: 8 }}
          textAlign={{ base: "center", md: "left" }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          {/* Company Info */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Text fontWeight="bold" color={textColor} fontSize="sm">
              The Data Proxy
            </Text>
            <Text color={textColor} fontSize="xs" maxW="200px">
              Enterprise proxy and scraping solutions for web data.
            </Text>
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 1, sm: 4 }}
              justify={{ base: "center", md: "start" }}
            >
              <Flex align="center" gap={1}>
                <Icon as={FiPhone} color={textColor} boxSize="0.9em" />
                <Text color={textColor} fontSize="xs">
                  +1 (855) 440-2242
                </Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FiMail} color={textColor} boxSize="0.9em" />
                <Link
                  href="mailto:info@thedataproxy.com"
                  color={textColor}
                  fontSize="xs"
                  _hover={{ color: hoverColor }}
                >
                  info@thedataproxy.com
                </Link>
              </Flex>
            </Flex>
          </VStack>
  
          {/* Support Links */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Link
              href="https://cloud.thedataproxy.com/faq"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              FAQ
            </Link>
            <Link
              href="https://cloud.thedataproxy.com/support"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Help & Support
            </Link>
          </VStack>
  
          {/* Social Media */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Flex gap={3}>
              <Link href="https://twitter.com" isExternal>
                <Icon
                  as={FiTwitter}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  boxSize="1em"
                />
              </Link>
              <Link href="https://linkedin.com" isExternal>
                <Icon
                  as={FiLinkedin}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  boxSize="1em"
                />
              </Link>
              <Link href="https://github.com" isExternal>
                <Icon
                  as={FiGithub}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  boxSize="1em"
                />
              </Link>
            </Flex>
          </VStack>
  
          {/* Legal Links */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Link
              href="https://cloud.thedataproxy.com/privacy-policy"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Privacy Policy
            </Link>
            <Link
              href="https://cloud.thedataproxy.com/terms-of-service"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Terms of Service
            </Link>
            <Link
              href="https://cloud.thedataproxy.com/cookie-policy"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Cookie Policy
            </Link>
            <Link
              href="https://cloud.thedataproxy.com/compliance"
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Compliance
            </Link>
          </VStack>
        </Flex>
  
        {/* Copyright */}
        <Text
          color={textColor}
          fontSize="xs"
          textAlign="center"
          mt={{ base: 3, md: 2 }}
        >
          © 2025 The Data Proxy, Cobalt Data Network. All rights reserved.
        </Text>
      </Box>
    );
  };
  
  export default Footer;