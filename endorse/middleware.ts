import type {Request, Response, NextFunction} from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import EndorseCollection from './collection';

/**
 * Checks if the passed in user can endorse the freet
 */
 const hasNotAlreadyEndorsed = async (req: Request, res: Response, next: NextFunction) => {
    const endorsement = await EndorseCollection.findOne(req.session.userId as string, req.body.freetId as string)
    
    if (endorsement) {
        res.status(404).json({
          error: `User has already endorsed the specified freet.`
        });
        return;
    }
  
    next();
  };

/**
 * Checks if the passed in user is a valid and current account holder
 */
 const isValidUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log('in middleware')
    console.log(req.query.endorser + ".")
    if (!req.query.endorser) {
        console.log('middleware should be here')
        res.status(400).json({
          error: 'Provided endorser username must be nonempty.'
        });
        return;
    }
    
      const user = await UserCollection.findOneByUsername(req.query.endorser as string);
      if (!user) {
        res.status(404).json({
          error: `A user with username ${req.query.endorser as string} does not exist.`
        });
        return;
    }
    
    next();
  };

/**
 * Checks if the passed in user can remove their endorsement from a freet
 */
 const isValidEndorseRemover = async (req: Request, res: Response, next: NextFunction) => {
    const endorsement = await EndorseCollection.findOne(req.session.userId as string, req.params.freetId as string)

    if (!endorsement) {
        res.status(404).json({
          error: `User has not endorsed the specified freet.`
        });
        return;
    }
  
    next();
  };

/**
 * Checks if a freet with req.body.freetId exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
    if (!freet) {
      res.status(404).json({
        error: {
          freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
        }
      });
      return;
    }
  
    next();
  };
  
export {
    hasNotAlreadyEndorsed,
    isValidEndorseRemover,
    isFreetExists,
    isValidUser
}