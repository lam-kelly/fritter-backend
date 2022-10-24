import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import EndorseCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as endorseValidator from '../endorse/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the endorsement objects corresponding with users who endorsed a certain freet
 *
 * @name GET /api/endorse?freet=freetId
 *
 * @return {EndorseResponse[]} - A list of all the freets that a user endorsed
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.query.freetId !== undefined) next(); // skip to the next middleware in this substack
      else if (req.query.endorser !== undefined) next('route');
      // else

        // throw error - unsupported 
        
    },
    [
      freetValidator.isFreetExists
    ],
    async (req: Request, res: Response) => {
        const endorsers = await EndorseCollection.findAllByFreetId(req.query.freetId as string);
        const response = endorsers.map(util.constructEndorseResponse);
        res.status(200).json(response);
    }
);

/**
 * Get the endorsement objects corresponding with the freets that a user endorsed
 *
 * @name GET /api/endorse?endorser=username
 *
 * @return {EndorseResponse[]} - An array of freets endorsed by user with id, endorseId
 * @throws {400} - If endorseId is not given
 * @throws {404} - If no user has given endorserId
 *
 */
router.get(
  '/',
  [
    endorseValidator.isValidUser
  ],
  async (req: Request, res: Response) => {
    console.log('here');
    if (req.query.endorser) 
    {
      const freets = await EndorseCollection.findAllByUsername(req.query.endorser as string);
      const response = freets.map(util.constructEndorseResponse);
      res.status(200).json(response);
    }
  }
);

/**
 * Endorse a freet.
 *
 * @name POST /api/endorse
 *
 * @param {string} freetId - The Id of the freet that the user endorses
 * @return {EndorseResponse} - The created endorsement
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freetId is empty or a stream of empty spaces
 * @throws {404} - If the user has already endorsed the freet
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    endorseValidator.isFreetExists,
    endorseValidator.hasNotAlreadyEndorsed,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const endorsement = await EndorseCollection.addOne(userId, req.body.freetId);

    res.status(201).json({
      message: 'You successfully endorsed freet with id ' + req.body.freetId,
      endorsement: util.constructEndorseResponse(endorsement)
    });
  }
);

/**
 * Remove endorsement (from freet)
 *
 * @name DELETE /api/endorse/:freetId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or has not endorsed the specified freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    endorseValidator.isValidEndorseRemover
  ],
  async (req: Request, res: Response) => {
    console.log("jadflsk;adsfjkl " + req.params.freetId)
    await EndorseCollection.deleteOne(req.session.userId, req.params.freetId);
    res.status(200).json({
      message: 'Your endorsement was deleted successfully.'
    });
  }
);

export {router as endorseRouter};
