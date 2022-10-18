import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follower} from './model';

// Update this if you add a property to the User type!
type FollowerResponse = {
  _id: string;
  follower: string;
  followee: string;
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Follower>} follower - A follower object
 * @returns {FollowerResponse} - The user object without the password
 */
const constructFollowerResponse = (follower: HydratedDocument<Follower>): FollowerResponse => {
  const followerCopy: Follower = {
    ...follower.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: followerCopy._id.toString(),
    follower: followerCopy.follower.toString(),
    followee: followerCopy.followee.toString()
  };
};

export {
  constructFollowerResponse
};
