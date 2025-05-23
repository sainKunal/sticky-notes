import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  VStack,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Container,
  useToast,
} from '@chakra-ui/react'
import { DeleteIcon, SearchIcon, ChevronDownIcon, CalendarIcon, BellIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Masonry from 'react-masonry-css'
import DatePicker from 'react-datepicker'
import { format, isSameDay, parseISO } from 'date-fns'

const MotionBox = motion(Box)

function NotesList({ notes, onDeleteNote }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const toast = useToast()

  const categories = ['personal', 'work', 'ideas', 'todos']
  const colors = {
    personal: 'teal.50',
    work: 'purple.50',
    ideas: 'blue.50',
    todos: 'orange.50'
  }

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)')
  const cardBg = useColorModeValue('white', 'gray.800')

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    const noteDate = new Date(note.timestamp)
    const matchesDate = isSameDay(noteDate, selectedDate)
    return matchesSearch && matchesCategory && matchesDate
  })

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} w="full">
        <Box textAlign="center" w="full">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, teal.400, blue.500)"
            bgClip="text"
            letterSpacing="tight"
            mb={4}
          >
            My Notes
          </Heading>
        </Box>

        <Box
          w="full"
          p={6}
          borderRadius="xl"
          bg={glassBg}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="xl"
        >
          <Flex gap={4} direction={{ base: 'column', md: 'row' }} w="full">
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="filled"
              />
            </InputGroup>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} whiteSpace="nowrap" minW="160px">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setSelectedCategory('all')}>All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Popover>
              <PopoverTrigger>
                <Button leftIcon={<CalendarIcon />} whiteSpace="nowrap" minW="150px">
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent p={0}>
                <PopoverBody p={0}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    inline
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Box>

        <Box w="full">
          <AnimatePresence>
            <Masonry
              breakpointCols={breakpointCols}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {filteredNotes.map(note => (
                <MotionBox
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                  p={4}
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="lg"
                  position="relative"
                  transition={{ duration: 0.2 }}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '2xl',
                  }}
                  mb={4}
                  borderLeft="4px solid"
                  borderLeftColor={colors[note.category].replace('.50', '.400')}
                >
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => onDeleteNote(note.id)}
                    colorScheme="red"
                    variant="ghost"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                  />
                  <VStack align="start" spacing={3}>
                    <Tag size="sm" variant="subtle" colorScheme={
                      note.category === 'personal' ? 'teal' :
                      note.category === 'work' ? 'purple' :
                      note.category === 'ideas' ? 'blue' : 'orange'
                    }>
                      <TagLabel>{note.category}</TagLabel>
                    </Tag>
                    <Text fontSize="xl" fontWeight="bold">
                      {note.title}
                    </Text>
                    <Text>{note.content}</Text>
                    <Flex w="full" justify="space-between" fontSize="xs" color="gray.500">
                      <Text>{format(parseISO(note.timestamp), 'MMM dd, yyyy')}</Text>
                      {note.reminder && note.reminderTime && (
                        <Flex alignItems="center" gap={1}>
                          <BellIcon />
                          <Text>{format(new Date(note.reminderTime), 'MMM dd, yyyy HH:mm')}</Text>
                        </Flex>
                      )}
                    </Flex>
                  </VStack>
                </MotionBox>
              ))}
            </Masonry>
          </AnimatePresence>
        </Box>
      </VStack>
    </Container>
  )
}

export default NotesList