import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a WordMask
 */

// Type definition for WordMask on the backend
export type WordMask = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  censoredWord: string;
  replacementWord: string;
};

export type PopulatedWordMask = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  censoredWord: string;
  replacementWord: string;
};

const WordMaskSchema = new Schema<WordMask>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  censoredWord: {
    type: String,
    required: true,
  },
  replacementWord: {
    type: String,
    required: true,
  },
});

const WordMaskModel = model<WordMask>('WordMask', WordMaskSchema);
export default WordMaskModel;
