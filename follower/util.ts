import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follower, PopulatedFollower} from './model';

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
  const followerCopy: PopulatedFollower = {
    ...follower.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const usernameFollower = followerCopy.follower.username;
  const usernameFollowee = followerCopy.followee.username;

  return {
    _id: followerCopy._id.toString(),
    follower: usernameFollower,
    followee: usernameFollowee
  };
};

export {
  constructFollowerResponse
};
