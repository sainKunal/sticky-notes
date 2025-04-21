import { Box, Flex, VStack, IconButton, useColorModeValue, Text, Divider } from '@chakra-ui/react'
import { HamburgerIcon, SunIcon, MoonIcon, CalendarIcon, InfoIcon, AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { colorMode, toggleColorMode } = useTheme()
  const location = useLocation()
  
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  const NavItem = ({ icon, children, to }) => {
    const isActive = location.pathname === to
    const activeBg = useColorModeValue('teal.50', 'teal.900')
    const activeColor = useColorModeValue('teal.700', 'teal.200')
    const hoverBg = useColorModeValue('gray.100', 'gray.700')
    
    return (
      <Link to={to} style={{ width: '100%' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? activeBg : 'transparent'}
          color={isActive ? activeColor : undefined}
          _hover={{
            bg: isActive ? activeBg : hoverBg,
          }}
        >
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            {icon}
          </Box>
          <Box
            ml="4"
            flex="2"
            display={isOpen ? "block" : "none"}
            transition="all 0.3s ease"
          >
            {children}
          </Box>
        </Flex>
      </Link>
    )
  }

  return (
    <Flex>
      {/* Sidebar */}
      <Box
        w={isOpen ? "240px" : "60px"}
        bg={bg}
        borderRight="1px"
        borderColor={borderColor}
        pos="fixed"
        h="100vh"
        transition="all 0.3s ease"
      >
        <Flex p="4" alignItems="center" justifyContent={isOpen ? "space-between" : "center"}>
          {isOpen && <Text fontSize="xl" fontWeight="bold">Menu</Text>}
          <IconButton
            icon={<HamburgerIcon />}
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            aria-label="Toggle menu"
          />
        </Flex>
        
        <Divider />
        
        <VStack spacing={2} align="stretch" mt={4}>
          <NavItem icon={<CalendarIcon />} to="/">
            Notes
          </NavItem>
          <NavItem icon={<AddIcon />} to="/add">
            Add Note
          </NavItem>
          <NavItem icon={<InfoIcon />} to="/about">
            About
          </NavItem>
          <Box px="4">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              w="full"
              display="flex"
              justifyContent={isOpen ? "flex-start" : "center"}
              aria-label="Toggle dark mode"
            />
          </Box>
        </VStack>
      </Box>

      {/* Main content */}
      <Box
        ml={isOpen ? "240px" : "60px"}
        transition="margin-left 0.3s ease"
        w="full"
      >
        {children}
      </Box>
    </Flex>
  )
}

export default Layout