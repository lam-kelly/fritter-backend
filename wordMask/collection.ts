import type {HydratedDocument, Types} from 'mongoose';
import type {WordMask} from './model';
import UserCollection from '../user/collection';
import WordMaskModel from './model';

class WordMaskCollection {
/**
   * Add a word mask to the collection
   *
   * @param {string} userId - The user that creates the word mask
   * @param {string} censoredWord - The word the user wants to censor
   * @param {string} replacementWord - The word to replace the censored word with
   * @return {Promise<HydratedDocument<WordMask>>} - The newly created word mask
   */
 static async addOne(userId: Types.ObjectId | string, censoredWord: string, replacementWord: string): Promise<HydratedDocument<WordMask>> {
    const wordMask = new WordMaskModel({
      userId,
      censoredWord,
      replacementWord
    });
    await wordMask.save();
    return await wordMask.populate('userId');
  }

  /**
   * Find a specific word mask with a specific censoredWord created by a user
   *
   * @param {string} userId - The user that creates the word mask
   * @param {string} censoredWord - The censored word of the Word Mask
   * @return {Promise<HydratedDocument<WordMask>> | Promise<null> } - The word mask in question, if any
   */
  static async findOneByCensoredWord(userId: Types.ObjectId | string, censoredWord: string): Promise<HydratedDocument<WordMask>> {
    return WordMaskModel.findOne({userId, censoredWord}).populate('userId');
  }

  /**
   * Find a specific word mask with its unique Id
   *
   * @param {string} userId - The user that creates the word mask
   * @param {string} censoredWord - The censored word of the Word Mask
   * @return {Promise<HydratedDocument<WordMask>> | Promise<null> } - The word mask in question, if any
   */
   static async findOneById(wordMaskId: Types.ObjectId | string): Promise<HydratedDocument<WordMask>> {
    return WordMaskModel.findOne({_id: wordMaskId}).populate('userId');
  }

  /**
   * Get all the word masks created by given user
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<WordMask>[]>} - An array of all of the word masks of the user that has userId
   */
  static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<WordMask>>> {
    return WordMaskModel.find({userId}).populate('userId');
  }

  /**
   * Delete the word mask with _id wordMaskId
   *
   * @param {string} wordMaskId - The Id of the word mask
   * @return {Promise<Boolean>} - true if the word mask has been deleted, false otherwise
   */
  static async deleteOne(wordMaskId: Types.ObjectId | string): Promise<boolean> {
    const wordMask = await WordMaskModel.deleteOne({_id: wordMaskId});
    return wordMask !== null;
  }

  /**
   * Update a word mask with a new replacement word
   *
   * @param {string} wordMaskId - The id of the word mask to update
   * @param {string} replacementWord - The word to replace the censored word with
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated word mask
   */
   static async updateOne(wordMaskId: Types.ObjectId | string, replacementWord: string): Promise<HydratedDocument<WordMask>> {
    const wordMask = await WordMaskModel.findOne({_id: wordMaskId});
    wordMask.replacementWord = replacementWord;
    await wordMask.save();
    return wordMask.populate('userId');
  }

  /**
   * Delete all the word masks by the given username
   *
   * @param {string} userId - The id of the user
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await WordMaskModel.deleteMany({endorserId: userId});
  }
}

export default WordMaskCollection;