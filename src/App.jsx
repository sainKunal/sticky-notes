import { useState, useEffect } from 'react'
import './App.css'
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea,
  useToast,
  IconButton,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  Select,
  useColorModeValue,
  VStack,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { DeleteIcon, SearchIcon, AddIcon, ChevronDownIcon, CalendarIcon, BellIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Masonry from 'react-masonry-css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { format, isSameDay, parseISO } from 'date-fns'

const MotionBox = motion(Box)

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    category: 'personal',
    date: new Date(),
    reminder: false,
    reminderTime: null
  })
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

  // Glassmorphism styles
  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(26, 32, 44, 0.8)'
  )
  const borderColor = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.1)'
  )

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Check for reminders every minute
    const intervalId = setInterval(() => {
      checkReminders();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const checkReminders = () => {
    const now = new Date();
    notes.forEach(note => {
      if (note.reminder && note.reminderTime) {
        const reminderTime = new Date(note.reminderTime);
        if (isSameDay(now, reminderTime) && 
            now.getHours() === reminderTime.getHours() && 
            now.getMinutes() === reminderTime.getMinutes()) {
          // Show notification
          if (Notification.permission === "granted") {
            new Notification(note.title, {
              body: note.content,
              icon: '/vite.svg'
            });
          }
          // Show toast
          toast({
            title: 'Reminder: ' + note.title,
            description: note.content,
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    });
  };

  const addNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both title and content',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    const note = {
      id: Date.now(),
      ...newNote,
      timestamp: new Date().toISOString(),
      color: colors[newNote.category]
    }

    setNotes(prev => [note, ...prev])
    setNewNote({ 
      title: '', 
      content: '', 
      category: 'personal',
      date: new Date(),
      reminder: false,
      reminderTime: null
    })
    
    toast({
      title: 'Note Added',
      status: 'success',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    })
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
    toast({
      title: 'Note Deleted',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    })
  }

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
            Sticky Notes
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
          <VStack spacing={4}>
            <Flex gap={4} direction={{ base: 'column', md: 'row' }} w="full">
              <InputGroup>
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
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
                  <Button leftIcon={<CalendarIcon />}>
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

            <Flex gap={4} direction={{ base: 'column', md: 'row' }} w="full">
              <Input
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                variant="filled"
              />
              <Select
                value={newNote.category}
                onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                variant="filled"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </Flex>

            <Textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              variant="filled"
              rows={4}
            />

            <Flex w="full" gap={4} alignItems="center">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="reminder" mb="0">
                  Set Reminder
                </FormLabel>
                <Switch
                  id="reminder"
                  isChecked={newNote.reminder}
                  onChange={(e) => setNewNote({ 
                    ...newNote, 
                    reminder: e.target.checked,
                    reminderTime: e.target.checked ? newNote.date : null 
                  })}
                />
              </FormControl>

              {newNote.reminder && (
                <Popover>
                  <PopoverTrigger>
                    <Button leftIcon={<BellIcon />}>
                      {newNote.reminderTime 
                        ? format(newNote.reminderTime, 'MMM dd, yyyy HH:mm')
                        : 'Set Time'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent p={0}>
                    <PopoverBody p={0}>
                      <DatePicker
                        selected={newNote.reminderTime || new Date()}
                        onChange={date => setNewNote({ ...newNote, reminderTime: date })}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        inline
                      />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}

              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={addNote}
                ml="auto"
                size="lg"
              >
                Add Note
              </Button>
            </Flex>
          </VStack>
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
                  bg={note.color}
                  borderRadius="lg"
                  boxShadow="lg"
                  position="relative"
                  transition={{ duration: 0.2 }}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '2xl',
                  }}
                  mb={4}
                >
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => deleteNote(note.id)}
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

export default App
