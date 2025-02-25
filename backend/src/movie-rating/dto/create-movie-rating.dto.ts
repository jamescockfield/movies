import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieRatingDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  declare rating: number;

  @IsString()
  declare movieId: string;

  @IsString()
  @IsOptional()
  declare comment?: string;
} 