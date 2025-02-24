import { IsBoolean, IsNumber, IsString, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsBoolean()
  declare adult: boolean;

  @IsString()
  @IsOptional()
  declare backdrop_path?: string;

  @IsNumber()
  declare id: number;

  @IsString()
  declare original_language: string;

  @IsString()
  declare title: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  declare vote_average: number;

  @IsArray()
  @IsNumber({}, { each: true })
  declare genre_ids: number[];
} 