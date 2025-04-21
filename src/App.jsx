import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Notes from './pages/Notes'
import AddNote from './pages/AddNote'
import { ThemeProvider } from './context/ThemeContext'
import { NotesProvider } from './context/NotesContext'

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Notes />} />
              <Route path="/add" element={<AddNote />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </NotesProvider>
    </ThemeProvider>
  )
}

export default App
