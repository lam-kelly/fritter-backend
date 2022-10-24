import type {Request, Response, NextFunction} from 'express';
import { Types } from 'mongoose';
import FreetCollection from '../freet/collection';
import WordMaskCollection from './collection';

/**
 * Checks if the chosen censored word is valid
 */
 const isCensoredWordValid = async (req: Request, res: Response, next: NextFunction) => {    
    if (!req.body.censoredWord.trim()) {
        res.status(400).json({
          error: 'The censored word for a Word Mask must be at least one character long.'
        });
        return;
      }

    next();
  };

/**
 * Checks if the user has already made a Word Mask with the chosen censored word
 */
 const isNewWordMask = async (req: Request, res: Response, next: NextFunction) => {
    const wordMask = await WordMaskCollection.findOneByCensoredWord(req.session.userId, req.body.censoredWord)

    if (wordMask) {
        res.status(404).json({
          error: `User already has a Word Mask associated with ` + req.body.censoredWord + `. Perhaps you want to edit this Word Mask instead?` 
        });
        return;
    }
  
    next();
  };

/**
 * Checks if a Word Mask with wordMaskId exists
 */
 const isWordMaskExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.wordMaskId);
    const wordMask = validFormat ? await WordMaskCollection.findOneById(req.params.wordMaskId as string) : '';

    if (!wordMask) {
        res.status(404).json({
          error: `A Word Mask with Id ${req.params.wordMaskId} doesn't exist.` 
        });
        return;
    }
  
    next();
  };

  /**
 * Checks if user can modify the Word Mask with wordMaskId
 */
 const isValidWordMaskModifier = async (req: Request, res: Response, next: NextFunction) => {
    const wordMask = await WordMaskCollection.findOneById(req.params.wordMaskId);
    const userId = wordMask.userId._id;
    if (req.session.userId !== userId.toString()) {
        res.status(403).json({
        error: 'Cannot modify other users\' word masks.'
        });
        return;
    }

    next();
  };
  
export {
    isCensoredWordValid,
    isNewWordMask,
    isWordMaskExists,
    isValidWordMaskModifier,
}