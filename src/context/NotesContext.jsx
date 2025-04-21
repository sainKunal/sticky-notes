import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const NotesContext = createContext();

const STORAGE_KEY = 'sticky_notes_data';

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage on initial render
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const toast = useToast();

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (newNote) => {
    const note = {
      id: Date.now(),
      ...newNote,
      timestamp: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: 'Note Deleted',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    });
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminder && note.reminderTime) {
          const reminderTime = new Date(note.reminderTime);
          if (now.getHours() === reminderTime.getHours() && 
              now.getMinutes() === reminderTime.getMinutes()) {
            if (Notification.permission === "granted") {
              new Notification(note.title, {
                body: note.content,
                icon: '/vite.svg'
              });
            }
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

    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, [notes, toast]);

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};