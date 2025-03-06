'use client';
import { useState, useEffect } from 'react';
import { Movie } from '@/types/types';
import { Box } from '@mui/material';
import { MovieListItem } from './MovieListItem';
import Slider from 'react-slick';

interface MovieListProps {
  shouldDisplay: boolean;
  genreName: string;
  movies: Movie[];
  onReady: () => void;
}

export default function MovieList({ shouldDisplay, genreName, movies, onReady }: MovieListProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onReady();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (!shouldDisplay) {
    return;
  }

  return (
    <Box sx={{ 
      '.slick-slide': { padding: '0 8px' },
      '.slick-list': { margin: '0 -8px' },
    }}>
      <Slider {...settings}>
        {movies.map((movie: Movie) => (
          <MovieListItem key={movie._id} genreName={genreName} movie={movie} />
        ))}
      </Slider>
    </Box>
  );
}