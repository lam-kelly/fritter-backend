import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Endorse
 */

// Type definition for Endorse on the backend
export type Endorse = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  endorserId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedEndorse = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  endorserId: User;
  freetId: Freet;
};

const EndorseSchema = new Schema<Endorse>({
  endorserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
});

const EndorseModel = model<Endorse>('Endorse', EndorseSchema);
export default EndorseModel;
