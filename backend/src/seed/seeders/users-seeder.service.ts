import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';
import { Genre } from '../../genre/genre.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  async generate(): Promise<void> {
    if (await this.userModel.exists({})) {
      console.log('Users already exist in database, skipping');
      return;
    }

    const genres = await this.genreModel.find().lean().exec();
    const users: Partial<User>[] = await Promise.all(genres.map(async (genre, index) => ({
      id: index + 1, // TODO: remove this
      username: `User ${index + 1}`,
      password: await bcrypt.hash('password', 10),
      genreId: genre.id,
    })));

    const result = await this.userModel.insertMany(users, { ordered: false });

    console.log(`Inserted ${result.length} users into database`);
  }
} 