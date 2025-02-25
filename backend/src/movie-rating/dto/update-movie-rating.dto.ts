import { PartialType } from "@nestjs/mapped-types";
import { CreateMovieRatingDto } from "./create-movie-rating.dto";

export class UpdateMovieRatingDto extends PartialType(CreateMovieRatingDto) {}