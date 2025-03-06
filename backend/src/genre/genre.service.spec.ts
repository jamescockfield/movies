import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreService } from './genre.service';
import { Genre } from './genre.schema';

describe('GenreService', () => {
  let service: GenreService;
  let genreModel: Model<Genre>;

  const mockGenre = {
    id: 1,
    name: 'Action',
  };

  // Create mock functions for the Mongoose query chain
  const mockFind = jest.fn();
  const mockSort = jest.fn();
  const mockExec = jest.fn();

  beforeEach(async () => {
    // Reset mock functions and set up the chain
    mockExec.mockResolvedValue([mockGenre]);
    mockSort.mockReturnValue({ exec: mockExec });
    mockFind.mockReturnValue({ sort: mockSort });
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getModelToken(Genre.name),
          useValue: {
            find: mockFind,
            findOne: jest.fn(),
            countDocuments: jest.fn(),
            new: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
    genreModel = module.get<Model<Genre>>(getModelToken(Genre.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres = [mockGenre];
      
      const result = await service.findAll();
      
      expect(result).toEqual(genres);
      expect(mockFind).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ name: 1 });
      expect(mockExec).toHaveBeenCalled();
    });
  });
}); 