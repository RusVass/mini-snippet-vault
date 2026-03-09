import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { GetSnippetsQueryDto } from './dto/get-snippets-query.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name)
    private readonly snippetModel: Model<SnippetDocument>,
  ) {}

  private validateSnippetId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid snippet id');
    }
  }

  public async create(createSnippetDto: CreateSnippetDto) {
    const preparedTags = (createSnippetDto.tags || []).map((tag) => tag.trim());

    const createdSnippet = await this.snippetModel.create({
      ...createSnippetDto,
      tags: preparedTags,
    });

    return createdSnippet;
  }

  public async findAll(queryDto: GetSnippetsQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (queryDto.q) {
      filter.$text = {
        $search: queryDto.q,
      };
    }

    if (queryDto.tag) {
      filter.tags = queryDto.tag;
    }

    if (queryDto.type) {
      filter.type = queryDto.type;
    }

    const [items, total] = await Promise.all([
      this.snippetModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.snippetModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: total === 0 ? 1 : Math.ceil(total / limit),
      },
    };
  }

  public async findOne(id: string) {
    this.validateSnippetId(id);

    const snippet = await this.snippetModel.findById(id).lean();

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    return snippet;
  }

  public async update(id: string, updateSnippetDto: UpdateSnippetDto) {
    this.validateSnippetId(id);

    const preparedDto = {
      ...updateSnippetDto,
      tags: updateSnippetDto.tags?.map((tag) => tag.trim()),
    };

    const updatedSnippet = await this.snippetModel
      .findByIdAndUpdate(id, preparedDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!updatedSnippet) {
      throw new NotFoundException('Snippet not found');
    }

    return updatedSnippet;
  }

  public async remove(id: string) {
    this.validateSnippetId(id);

    const deletedSnippet = await this.snippetModel.findByIdAndDelete(id).lean();

    if (!deletedSnippet) {
      throw new NotFoundException('Snippet not found');
    }

    return {
      message: 'Snippet deleted successfully',
    };
  }
}
