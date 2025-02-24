import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre } from './genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: number): Promise<Genre | null> {
    return this.genreModel.findOne({ id }).exec();
  }

  async create(genreData: { id: number; name: string }): Promise<Genre> {
    const genre = new this.genreModel(genreData);
    return genre.save();
  }

  async hasAny(): Promise<boolean> {
    return (await this.genreModel.countDocuments().exec()) > 0;
  }
}