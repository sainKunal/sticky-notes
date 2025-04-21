import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Flex,
  Icon,
} from '@chakra-ui/react'
import { CheckCircleIcon, StarIcon } from '@chakra-ui/icons'

const About = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          p={8}
          bg={bgColor}
          borderRadius="xl"
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="start">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, teal.400, blue.500)"
              bgClip="text"
            >
              About Sticky Notes
            </Heading>
            
            <Text fontSize="lg">
              A modern, feature-rich note-taking application built with React and Chakra UI.
              Keep your thoughts organized with categories, reminders, and a beautiful interface.
            </Text>

            <Heading as="h2" size="lg" mt={6}>
              Features
            </Heading>
            
            <List spacing={3}>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={CheckCircleIcon} color="teal.500" />
                  <Text>Organize notes with categories and tags</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={CheckCircleIcon} color="teal.500" />
                  <Text>Set reminders with notifications</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={CheckCircleIcon} color="teal.500" />
                  <Text>Dark mode support</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={CheckCircleIcon} color="teal.500" />
                  <Text>Responsive design</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={CheckCircleIcon} color="teal.500" />
                  <Text>Search and filter capabilities</Text>
                </Flex>
              </ListItem>
            </List>

            <Heading as="h2" size="lg" mt={6}>
              Technologies Used
            </Heading>
            
            <List spacing={3}>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={StarIcon} color="yellow.500" />
                  <Text>React with Vite</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={StarIcon} color="yellow.500" />
                  <Text>Chakra UI for modern interface</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={StarIcon} color="yellow.500" />
                  <Text>React Router for navigation</Text>
                </Flex>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={StarIcon} color="yellow.500" />
                  <Text>Context API for state management</Text>
                </Flex>
              </ListItem>
            </List>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default About