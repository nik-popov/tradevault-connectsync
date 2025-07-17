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
    const accentColor = "orange.400"
    const hoverColor = "orange.600";
  
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
          <Link
      href="https://tradevaultco.com" 
      isExternal
      color={textColor}
      _hover={{ color: accentColor }}
    >
      <Text
        fontWeight="bold"
        color={textColor}
        fontSize="sm"
      >
        trade vault LLC
      </Text>
    </Link>
            <Text color={textColor} fontSize="xs" maxW="200px">
              Enterprise proxy and scraping solutions for web data.
            </Text>
          </VStack>
  
          {/* Contact Info */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Flex align="center" gap={1}>
              <Icon as={FiPhone} color={textColor} boxSize="0.9em" />
              <Text color={textColor} fontSize="xs">
                +1 ‪(833) 435-3873‬
              </Text>
            </Flex>
            <Flex align="center" gap={1}>
              <Icon as={FiMail} color={textColor} boxSize="0.9em" />
              <Link
                href="mailto:info@tradevaultco.com"
                color={textColor}
                fontSize="xs"
                _hover={{ color: hoverColor }}
              >
                info@tradevaultco.com
              </Link>
            </Flex>
          </VStack>
    {/* Social Media */}
    <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Flex gap={3}>
              <Link href="https://x.com/cobaltdata" isExternal>
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
              <Link href="https://github.com/cobaltdatanetwork" isExternal>
                <Icon
                  as={FiGithub}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  boxSize="1em"
                />
              </Link>
            </Flex>
          </VStack>
  
          {/* Support Links */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Link
              href="https://tradevaultco.com/resources/faq"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              FAQ
            </Link>
            <Link
              href="https://tradevaultco.com/contact"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Help & Support
            </Link>
          </VStack>
  
    
          {/* Legal Links */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Link
              href="https://tradevaultco.com/privacy"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Privacy Policy
            </Link>
            <Link
              href="https://tradevaultco.com/terms"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Terms of Service
            </Link>
          </VStack>
  
          {/* Additional Legal Links */}
          <VStack spacing={1} align={{ base: "center", md: "start" }}>
            <Link
              href="https://tradevaultco.com/cookie"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Cookie Policy
            </Link>
            <Link
              href=" https://tradevaultco.com/compliance"
              isExternal
              color={textColor}
              fontSize="xs"
              _hover={{ color: hoverColor }}
            >
              Compliance
            </Link>
          </VStack>
        </Flex>
  
        {/* Copyright and Links */}
      <Text
        color={textColor}
        fontSize="xs"
        textAlign="center"
        mt={{ base: 3, md: 2 }}
      >
        © 2025{" "}
        <Link
          href="https://tradevaultco.com"
          isExternal
          color={textColor}
          _hover={{ color: accentColor }}
        >
          trade vault LLC
        </Link>
        ,{" "}
        <Link
          href="https://cobaltdata.net"
          isExternal
          color={textColor}
          _hover={{ color: hoverColor }}
        >
          Cobalt Data Network
        </Link>
        . All rights reserved.
      </Text>
      </Box>
    );
  };
  
  export default Footer;