import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieRatingDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  movieId: string;

  @IsString()
  @IsOptional()
  comment?: string;
} 