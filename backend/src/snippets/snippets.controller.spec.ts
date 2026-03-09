import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { SnippetType } from './schemas/snippet.schema';

describe('SnippetsController', () => {
  let controller: SnippetsController;
  let snippetsServiceMock: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    snippetsServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnippetsController],
      providers: [
        {
          provide: SnippetsService,
          useValue: snippetsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SnippetsController>(SnippetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create with dto', async () => {
    const dto = {
      title: 'Nest docs',
      content: 'https://docs.nestjs.com',
      tags: ['nestjs'],
      type: SnippetType.LINK,
    };
    snippetsServiceMock.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(snippetsServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should call service findAll with query', async () => {
    const query = { q: 'nest', page: 1, limit: 10 };
    const response = {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
    snippetsServiceMock.findAll.mockResolvedValue(response);

    const result = await controller.findAll(query);

    expect(snippetsServiceMock.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(response);
  });

  it('should call service findOne with id', async () => {
    const snippet = { _id: '507f1f77bcf86cd799439011' };
    snippetsServiceMock.findOne.mockResolvedValue(snippet);

    const result = await controller.findOne('507f1f77bcf86cd799439011');

    expect(snippetsServiceMock.findOne).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
    expect(result).toEqual(snippet);
  });
});
