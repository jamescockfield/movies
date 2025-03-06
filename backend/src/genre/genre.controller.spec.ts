import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GenreController', () => {
  let controller: GenreController;
  let genreService: MockProxy<GenreService>;

  const mockGenre = {
    id: 1,
    name: 'Action',
  };

  beforeEach(async () => {
    // Create a type-safe mock of the service
    genreService = mock<GenreService>();
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: genreService,
        },
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres = [mockGenre];
      genreService.findAll.mockResolvedValue(genres);

      const result = await controller.findAll();
      expect(result).toEqual(genres);
      expect(genreService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a genre by id', async () => {
      genreService.findById.mockResolvedValue(mockGenre);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockGenre);
      expect(genreService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when genre is not found', async () => {
      genreService.findById.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException('Genre with ID 999 not found'),
      );
      expect(genreService.findById).toHaveBeenCalledWith(999);
    });
  });
}); 