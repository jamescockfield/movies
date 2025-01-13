import { useEffect, useState } from 'react'
import { Box, Grid, Image, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'

interface Movie {
  title: string
  poster_path: string
  overview: string
  vote_average: number
}

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies')
        setMovies(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    fetchMovies()
  }, [])

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
      {movies.map((movie, index) => (
        <Box key={index} borderRadius="lg" overflow="hidden" bg="white" shadow="md">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fallbackSrc="https://via.placeholder.com/500x750"
          />
          <VStack p={4} align="start">
            <Text fontWeight="bold" fontSize="lg">{movie.title}</Text>
            <Text fontSize="sm" noOfLines={3}>{movie.overview}</Text>
            <Text color="teal.500">Rating: {movie.vote_average}/10</Text>
          </VStack>
        </Box>
      ))}
    </Grid>
  )
}