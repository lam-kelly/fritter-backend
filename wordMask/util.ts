import type {HydratedDocument} from 'mongoose';
import type {WordMask, PopulatedWordMask} from './model';

type WordMaskResponse = {
  _id: string;
  userId: string;
  censoredWord: string;
  replacementWord: string
};

/**
 * Transform a raw WordMask object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<WordMask>} wordMask - A WordMask object
 * @returns {WordMaskrResponse} - A copy of the WordMask object
 */
const constructWordMaskResponse = (wordMask: HydratedDocument<WordMask>): WordMaskResponse => {
  const wordMaskCopy: PopulatedWordMask = {
    ...wordMask.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = wordMaskCopy.userId;
  delete wordMaskCopy.userId

  return {
    ...wordMaskCopy,
    _id: wordMaskCopy._id.toString(),
    userId: username,
  };
};

export {
  constructWordMaskResponse as constructWordMaskResponse
};
