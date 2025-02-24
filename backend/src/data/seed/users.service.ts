import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';
import { Genre } from '../../genre/genre.schema';

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
    const users: Partial<User>[] = genres.map((genre, index) => ({
      id: index + 1,
      username: `User ${index + 1}`,
      genreId: genre.id,
    }));

    console.log(`Inserting ${users.length} users into database`);
    await this.userModel.insertMany(users, { ordered: false });
    console.log('Users inserted');
  }
} 