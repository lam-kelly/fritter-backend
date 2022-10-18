import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followerValidator from '../follower/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all followees of a user.
 *
 * @name GET /api/follows?follower=user
 *
 * @return {FollowerResponse[]} - An array of follower-followee relations where the follower is the user
 * @throws {400} - If follower is not given
 * @throws {404} - If the follower is not a valid user
 *
 */
/**
 * Get all followers of a user.
 *
 * @name GET /api/follows?followee=user
 *
 * @return {FollowerResponse[]} - An array of follower-followee relations where the followee is the user
 * @throws {400} - If followee is not given
 * @throws {404} - If the followee is not a valid user
 *
 */
 router.get(
    '/',
    [
        followerValidator.isUsernameExists
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if follower query parameter was supplied
        if (req.query.follower !== undefined) {
          next();
          return;
        }

        else if (req.query.followee !== undefined) {
            console.log("should be here")
            const followers = await FollowerCollection.findAllFollowersOfUsername(req.query.followee as string);
            console.log("after db query")
            const response = followers.map(util.constructFollowerResponse);
            res.status(200).json(response);
        }
    },
    async (req: Request, res: Response) => {
        const followees = await FollowerCollection.findAllFolloweesOfUsername(req.query.follower as string);
        const response = followees.map(util.constructFollowerResponse);
        res.status(200).json(response);
    }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follows/:followee?'
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the user is not currently following the followee or if the followee doesn't exist
 */
 router.delete(
    '/:followee?',
    [
        userValidator.isUserLoggedIn,
        followerValidator.isFolloweeExists,
    ],
    async (req: Request, res: Response) => {
        await FollowerCollection.deleteOne(req.session.userId, req.params.followee);
        res.status(200).json({
            message: 'Your unfollowed successfully.'
        });
    }
);

/**
 * Follow a new user
 *
 * @name POST /api/follows
 *
 * @param {string} followee - The username of the followee that the user is following
 * @return {FollowerResponse} - The created follower relationship
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the followee is empty or a stream of empty spaces or if user tries to follow themselves
 * @throws {404} - If the user is already following the followee or the followee doesn't exist
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        followerValidator.isValidFollowee,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        console.log("req: " + req.body.followee)
        console.log("userId: " + userId)
        const follower = await FollowerCollection.addOne(userId, req.body.followee);
        console.log("done")
        res.status(201).json({
            message: 'You successfully followed ' + userId,
            follower: util.constructFollowerResponse(follower)
        });
    }
);

export {router as followerRouter};
