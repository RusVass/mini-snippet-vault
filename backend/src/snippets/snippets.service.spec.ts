import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { Snippet, SnippetType } from './schemas/snippet.schema';

describe('SnippetsService', () => {
  let service: SnippetsService;
  let snippetModelMock: {
    create: jest.Mock;
    find: jest.Mock;
    countDocuments: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  const buildQueryMock = <T>(result: T) => {
    return {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(result),
    };
  };

  beforeEach(async () => {
    snippetModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnippetsService,
        {
          provide: getModelToken(Snippet.name),
          useValue: snippetModelMock,
        },
      ],
    }).compile();

    service = module.get<SnippetsService>(SnippetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trim tags on create', async () => {
    const createdSnippet = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Docs',
      content: 'https://docs.example.com',
      tags: ['nestjs', 'backend'],
      type: SnippetType.LINK,
    };

    snippetModelMock.create.mockResolvedValue(createdSnippet);

    const result = await service.create({
      title: 'Docs',
      content: 'https://docs.example.com',
      tags: [' nestjs ', 'backend '],
      type: SnippetType.LINK,
    });

    expect(snippetModelMock.create).toHaveBeenCalledWith({
      title: 'Docs',
      content: 'https://docs.example.com',
      tags: ['nestjs', 'backend'],
      type: SnippetType.LINK,
    });
    expect(result).toEqual(createdSnippet);
  });

  it('should return paginated snippets with filters', async () => {
    const items = [
      {
        _id: '507f1f77bcf86cd799439011',
        title: 'Nest docs',
        content: 'Useful docs',
        tags: ['backend'],
        type: SnippetType.LINK,
      },
    ];
    const query = buildQueryMock(items);

    snippetModelMock.find.mockReturnValue(query);
    snippetModelMock.countDocuments.mockResolvedValue(1);

    const result = await service.findAll({
      q: 'nest',
      tag: 'backend',
      type: SnippetType.LINK,
      page: 2,
      limit: 5,
    });

    expect(snippetModelMock.find).toHaveBeenCalledWith({
      $text: { $search: 'nest' },
      tags: 'backend',
      type: SnippetType.LINK,
    });
    expect(result.meta).toEqual({
      total: 1,
      page: 2,
      limit: 5,
      totalPages: 1,
    });
  });

  it('should throw 400 for invalid snippet id in findOne', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
    expect(snippetModelMock.findById).not.toHaveBeenCalled();
  });

  it('should throw 404 when snippet is missing in update', async () => {
    const query = {
      lean: jest.fn().mockResolvedValue(null),
    };
    snippetModelMock.findByIdAndUpdate.mockReturnValue(query);

    await expect(
      service.update('507f1f77bcf86cd799439011', {
        title: 'Updated',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should trim tags and pass validators on update', async () => {
    const updatedSnippet = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Updated',
      content: 'Updated content',
      tags: ['api', 'nestjs'],
      type: SnippetType.NOTE,
    };
    const query = {
      lean: jest.fn().mockResolvedValue(updatedSnippet),
    };
    snippetModelMock.findByIdAndUpdate.mockReturnValue(query);

    const result = await service.update('507f1f77bcf86cd799439011', {
      title: 'Updated',
      tags: [' api ', 'nestjs '],
    });

    expect(snippetModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      {
        title: 'Updated',
        tags: ['api', 'nestjs'],
      },
      {
        new: true,
        runValidators: true,
      },
    );
    expect(result).toEqual(updatedSnippet);
  });

  it('should throw 400 for invalid snippet id in remove', async () => {
    await expect(service.remove('bad-id')).rejects.toThrow(BadRequestException);
    expect(snippetModelMock.findByIdAndDelete).not.toHaveBeenCalled();
  });
});
