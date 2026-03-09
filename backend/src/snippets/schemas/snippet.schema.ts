import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnippetDocument = HydratedDocument<Snippet>;

export enum SnippetType {
  LINK = 'link',
  NOTE = 'note',
  COMMAND = 'command',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Snippet {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  content: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    required: true,
    enum: SnippetType,
  })
  type: SnippetType;

  createdAt: Date;
  updatedAt: Date;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({
  title: 'text',
  content: 'text',
});
