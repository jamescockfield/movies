import { ChakraProvider, Box, Container } from '@chakra-ui/react'
import { MovieList } from './components/MovieList'
import { Navigation } from './components/Navigation'

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Navigation />
        <Container maxW="container.xl" py={8}>
          <MovieList />
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App