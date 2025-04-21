import { useNavigate } from 'react-router-dom'
import NotesList from '../components/NotesList'
import { Button, Box } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useNotes } from '../context/NotesContext'

function Notes() {
  const { notes, deleteNote } = useNotes()
  const navigate = useNavigate()

  return (
    <>
      <NotesList notes={notes} onDeleteNote={deleteNote} />
      <Box position="fixed" bottom="4" right="4">
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          size="lg"
          onClick={() => navigate('/add')}
          boxShadow="lg"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          }}
        >
          Add Note
        </Button>
      </Box>
    </>
  )
}

export default Notes