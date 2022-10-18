import type {Request, Response, NextFunction} from 'express';
import FollowerCollection from '../follower/collection';
import UserCollection from '../user/collection';

/**
 * Checks if the follower/followee is an account holder
 */
 const isUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.follower && !req.query.followee) {
        res.status(400).json({
            error: 'Provided username must be nonempty.'
        });
        return;
    } 

    const follower = await UserCollection.findOneByUsername(req.query.follower as string);
    const followee = await UserCollection.findOneByUsername(req.query.followee as string);

    if (!follower && !followee) {
        res.status(404).json({
          error: `A user with the provided username does not exist.`
        });
        return;
    }
  
    next();
  };

/**
 * Checks if the user is currently following a followee
 */
const isFolloweeExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.followee) {
        res.status(400).json({
            error: 'Provided followee username must be nonempty.'
        });
        return;
    } 

    const followee = await UserCollection.findOneByUsername(req.params.followee)
    console.log("followee: " + followee)
    if (!followee) {
        res.status(404).json({
            error: `The user ${req.params.followee as string} doesn't exist.`
          });
          return;
    }

    const isValidFollowee = await FollowerCollection.findOne(req.session.userId, req.params.followee as string);
    console.log("should be empty: " + isValidFollowee)
    console.log(!isValidFollowee)
    if (!isValidFollowee) {
        res.status(404).json({
          error: `The user is not following ${req.params.followee as string}.`
        });
        return;
    }
  
    next();
  };

/**
 * Checks if the user is currently following a followee
 */
 const isValidFollowee = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.followee) {
        res.status(400).json({
            error: 'Provided followee username must be nonempty.'
        });
        return;
    }

    const followee = await UserCollection.findOneByUsername(req.body.followee)
    console.log("followee: " + followee)
    if (!followee) {
        res.status(404).json({
            error: `The user ${req.body.followee as string} doesn't exist.`
          });
          return;
    }

    const isExistingFollowee = await FollowerCollection.findOne(req.session.userId, req.body.followee as string);

    if (req.session.userId == followee._id) {
        res.status(400).json({
            error: `A user cannot follow themselves.`
        });
        return;
    }

    if (isExistingFollowee) {
        res.status(404).json({
          error: `The user is already following ${req.body.followee as string}.`
        });
        return;
    }
  
    next();
  };
  
export {
    isUsernameExists,
    isFolloweeExists,
    isValidFollowee,
}