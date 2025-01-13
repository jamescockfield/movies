import { Box, Container, Heading, Flex } from '@chakra-ui/react'

export function Navigation() {
  return (
    <Box bg="teal.500" py={4}>
      <Container maxW="container.xl">
        <Flex align="center">
          <Heading size="lg" color="white">Movie Recommendations</Heading>
        </Flex>
      </Container>
    </Box>
  )
}