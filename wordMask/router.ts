import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import WordMaskCollection from './collection';
import * as userValidator from '../user/middleware';
import * as wordMaskValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all of the user's word masks
 *
 * @name GET /api/word-mask
 *
 * @return {WordMaskResponse[]} - A list of all the user's word masks
 * @throws {403} if user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const wordMasks = await WordMaskCollection.findAll(req.session.userId as string);
    const response = wordMasks.map(util.constructWordMaskResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new word mask.
 *
 * @name POST /api/word-mask
 *
 * @param {string} censoredWord - The word to censor
 * @param {string} replacementWord - The word to replace the censored word with
 * @return {WordMaskResponse} - The created word mask
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the censoredWord is empty or a stream of empty spaces
 * @throws {404} - If the word mask already exists
*/
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    wordMaskValidator.isCensoredWordValid,
    wordMaskValidator.isNewWordMask
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const wordMask = await WordMaskCollection.addOne(userId, req.body.censoredWord, req.body.replacementWord);

    res.status(201).json({
      message: 'Your word mask was created successfully.',
      wordMask: util.constructWordMaskResponse(wordMask)
    });
  }
);

/**
 * Delete a word mask
 *
 * @name DELETE /api/word-mask/:wordMaskId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or did not create the word mask
 * @throws {404} - If the id of the word mask is not valid
 */
router.delete(
  '/:wordMaskId?',
  [
    userValidator.isUserLoggedIn,
    wordMaskValidator.isWordMaskExists,
    wordMaskValidator.isValidWordMaskModifier
  ],
  async (req: Request, res: Response) => {
    await WordMaskCollection.deleteOne(req.params.wordMaskId);
    res.status(200).json({
      message: 'Your word mask was deleted successfully.'
    });
  }
);

/**
 * Modify the replacement word of the word mask
 *
 * @name PUT /api/word-mask/:wordMaskId?
 *
 * @param {string} replacementWord - the new replacement word that corresponds with the censored word
 * @return {WordMaskResponse} - the updated word mask
 * @throws {403} - if the user is not logged in or did not create the word mask
 * @throws {404} - If the word mask Id is not valid
 */
router.put(
  '/:wordMaskId?',
  [
    userValidator.isUserLoggedIn,
    wordMaskValidator.isWordMaskExists,
    wordMaskValidator.isValidWordMaskModifier
  ],
  async (req: Request, res: Response) => {
    const wordMask = await WordMaskCollection.updateOne(req.params.wordMaskId, req.body.replacementWord);
    res.status(200).json({
      message: 'Your word mask was updated successfully.',
      wordMask: util.constructWordMaskResponse(wordMask)
    });
  }
);

export {router as wordMaskRouter};
