import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Textarea,
  useToast,
  Select,
  useColorModeValue,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react'
import { AddIcon, BellIcon } from '@chakra-ui/icons'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'

function AddNote() {
  const navigate = useNavigate()
  const { addNote } = useNotes()
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    category: 'personal',
    date: new Date(),
    reminder: false,
    reminderTime: null
  })
  const toast = useToast()

  const categories = ['personal', 'work', 'ideas', 'todos']
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)')

  const handleSubmit = () => {
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

    addNote(newNote)
    toast({
      title: 'Note Added',
      status: 'success',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    })
    navigate('/')
  }

  return (
    <Container maxW="container.md" py={8}>
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
            Add New Note
          </Heading>
        </Box>

        <Box
          w="full"
          p={8}
          borderRadius="xl"
          bg={glassBg}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="xl"
        >
          <VStack spacing={6}>
            <Input
              placeholder="Note Title"
              size="lg"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              variant="filled"
            />

            <Select
              size="lg"
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

            <Textarea
              placeholder="Note Content"
              size="lg"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              variant="filled"
              rows={8}
            />

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
                  <Button leftIcon={<BellIcon />} w="full">
                    {newNote.reminderTime 
                      ? format(newNote.reminderTime, 'MMM dd, yyyy HH:mm')
                      : 'Set Reminder Time'
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
              onClick={handleSubmit}
              size="lg"
              w="full"
            >
              Add Note
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default AddNote