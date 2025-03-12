import React, { useState } from 'react';
import {
  Container,
  Text,
  Button,
  VStack,
  Divider,
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { FiSend, FiGithub, FiInfo } from 'react-icons/fi';
import PromoSERP from '../../../../components/ComingSoon';
import WhitelistGSerp from '../../../../components/WhitelistGSerp';

const STORAGE_KEY = 'subscriptionSettings';
const PRODUCT = 'serp';

// Replace with your actual Codespaces forwarded URL for port 3000
const SERVER_URL = 'https://dev-image-distro.popovtech.com';

export const Route = createFileRoute('/_layout/scraping-api/submit-form/google-serp')({
  component: GoogleSerpForm,
});

function GoogleSerpForm() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: subscriptionSettings } = useQuery({
    queryKey: ['subscriptionSettings'],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const { hasSubscription, isTrial, isDeactivated } = settings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  const [file, setFile] = useState<File | null>(null); // Explicitly typed as File | null
  const [imageColumn, setImageColumn] = useState('Image URL');
  const [searchCol, setSearchCol] = useState('Style');
  const [brandCol, setBrandCol] = useState('Brand');
  const [colorCol, setColorCol] = useState('Color');
  const [categoryCol, setCategoryCol] = useState('Category');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendToEmail = 'your.email@example.com'; // Replace with your actual email

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid File',
        description: 'Please upload a valid Excel file (.xlsx).',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Missing File',
        description: 'Please upload an Excel file.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    if (!imageColumn || !searchCol || !brandCol) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please provide Image, Style/Search, and Brand columns.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('fileUploadImage', file);
    formData.append('imageColumnImage', imageColumn);
    formData.append('searchColImage', searchCol);
    formData.append('brandColImage', brandCol);
    formData.append('ColorColImage', colorCol);
    formData.append('CategoryColImage', categoryCol);
    formData.append('sendToEmail', sendToEmail);

    try {
      console.log('Submitting to direct server URL with FormData:', {
        file: file.name, // Now valid because file is typed and checked
        imageColumnImage: imageColumn,
        searchColImage: searchCol,
        brandColImage: brandCol,
        ColorColImage: colorCol,
        CategoryColImage: categoryCol,
        sendToEmail,
      });

      const response = await fetch(`${SERVER_URL}/submitImage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        toast({
          title: 'Request Submitted',
          description: 'Your request with file has been successfully submitted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setFile(null);
        setImageColumn('Image URL');
        setSearchCol('Style');
        setBrandCol('Brand');
        setColorCol('Color');
        setCategoryCol('Category');
        navigate({ to: '/scraping-api/submit-form/success' });
      } else {
        toast({
          title: 'Submission Failed',
          description: data.message || 'Failed to submit the request.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Error',
        description: `An error occurred: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="full">
      <VStack spacing={6} align="stretch">
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              Google SERP Scraper
            </Text>
            <Text fontSize="sm" color="gray.500">
              Upload an Excel file and specify columns for SERP scraping.
            </Text>
          </Box>
          <Badge colorScheme={isLocked ? 'red' : 'green'} alignSelf="center">
            {isLocked ? 'Subscription Required' : 'Active'}
          </Badge>
        </Flex>

        <Divider borderColor="gray.700" />

        {isLocked ? (
          <PromoSERP />
        ) : isFullyDeactivated ? (
          <Box p={6} bg="red.900" borderRadius="md" textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="red.200" mb={2}>
              Subscription Deactivated
            </Text>
            <Text color="red.300">
              Your account is deactivated. Please renew your subscription to request scraping.
            </Text>
            <Button
              mt={4}
              colorScheme="blue"
              size="md"
              onClick={() => navigate({ to: '/proxies/pricing' })}
            >
              Reactivate Subscription
            </Button>
          </Box>
        ) : (
          <Flex gap={8} justify="space-between" align="stretch" wrap="wrap">
            <Box flex="2" minW={{ base: '100%', md: '60%' }}>
              <Box
                p={6}
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="lg"
                boxShadow="md"
              >
                <VStack spacing={5} align="stretch">
                  <FormControl isRequired>
                    <FormLabel color="gray.300">Upload Excel File</FormLabel>
                    <Input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                      p={1}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Image Column</FormLabel>
                    <Input
                      placeholder="e.g., Image URL"
                      value={imageColumn}
                      onChange={(e) => setImageColumn(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Style/Search Column</FormLabel>
                    <Input
                      placeholder="e.g., Style"
                      value={searchCol}
                      onChange={(e) => setSearchCol(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Brand Column</FormLabel>
                    <Input
                      placeholder="e.g., Brand"
                      value={brandCol}
                      onChange={(e) => setBrandCol(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.300">Color Column</FormLabel>
                    <Input
                      placeholder="e.g., Color"
                      value={colorCol}
                      onChange={(e) => setColorCol(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.300">Category Column</FormLabel>
                    <Input
                      placeholder="e.g., Category"
                      value={categoryCol}
                      onChange={(e) => setCategoryCol(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: 'gray.500' }}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    leftIcon={<FiSend />}
                    size="md"
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    onClick={handleSubmit}
                    w="full"
                  >
                    Submit Request
                  </Button>
                </VStack>
              </Box>
            </Box>

            <Box w={{ base: '100%', md: '300px' }} p={4}>
              <VStack spacing={6} align="stretch">
                <Box
                  p={4}
                  bg="gray.800"
                  border="1px solid"
                  borderColor="gray.700"
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text fontWeight="semibold" mb={3} color="white">
                    Quick Actions
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Button
                      as="a"
                      href="https://github.com/iconluxurygroup"
                      target="_blank"
                      leftIcon={<FiGithub />}
                      variant="outline"
                      size="md"
                      colorScheme="gray"
                      borderColor="gray.600"
                      color="gray.200"
                      _hover={{ bg: 'gray.700' }}
                    >
                      Discuss on GitHub
                    </Button>
                  </VStack>
                </Box>

                <Box>
                  <Flex align="center" mb={2}>
                    <Icon as={FiInfo} color="blue.300" mr={2} />
                    <Text fontWeight="semibold" color="white">
                      Need Help?
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.400">
                    Contact us via{' '}
                    <Button
                      as="a"
                      href="mailto:support@iconluxury.group"
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                    >
                      email
                    </Button>{' '}
                    or check our{' '}
                    <Button as="a" href="/docs" variant="link" colorScheme="blue" size="sm">
                      documentation
                    </Button>.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Flex>
        )}
      </VStack>
    </Container>
  );
}

export default GoogleSerpForm;