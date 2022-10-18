import type {HydratedDocument, Types} from 'mongoose';
import type {Follower} from './model';
import UserCollection from '../user/collection';
import FollowerModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowerCollection {
  /**
   * Add a (follower, followee) pair
   *
   * @param {string} follower - The id of the follower
   * @param {string} followee - The id of the followee
   * @return {Promise<HydratedDocument<Follower>>} - The newly created follower
   */
  static async addOne(followerId: Types.ObjectId | string, followee: string): Promise<HydratedDocument<Follower>> {
    const followeeId = await (await UserCollection.findOneByUsername(followee))._id;
    const follow = new FollowerModel({
        follower: followerId,
        followee: followeeId
    });
    
    await follow.save();
    return follow;
  }

  /**
   * Unfollow a followee given followerId and followeeId
   *
   * @param {string} followerId - The Id of the follower that is unfollowing
   * @param {string} followeeId - The Id of the followee this is being unfollowed
   * @return {Promise<Boolean>} - true if the follower has unfollowed the followee, false otherwise
   */
   static async deleteOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<boolean> {
    const follower = await FollowerModel.deleteOne({followeeId, followerId});
    return follower !== null;
  }

  /**
   * Get one (follower,followee) pair
   *
   * @param {string} followerId - The Id of the follower that is unfollowing
   * @param {string} followeeId - The Id of the followee this is being unfollowed
   * @return {Promise<Boolean>} - true if the follower has unfollowed the followee, false otherwise
   */
   static async findOne(followerId: Types.ObjectId | string, followeeUsername: string): Promise<Array<HydratedDocument<Follower>>> {
    const followee = await UserCollection.findOneByUsername(followeeUsername);
    return FollowerModel.findOne({follower: followerId, followee: followee._id});
  }

  /**
   * Get all people that a user is following
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the people that a user is following
   */
   static async findAllFolloweesOfUsername(username: string): Promise<Array<HydratedDocument<Follower>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowerModel.find({follower: user._id});
  }

  /**
   * Get all people is following the user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the people that a user is following
   */
   static async findAllFollowersOfUsername(username: string): Promise<Array<HydratedDocument<Follower>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowerModel.find({followee: user._id});
  }

  /**
   * Unfollow all the followees that a user is following 
   *
   * @param {string} followerId - The Id of the follower to delete
   */
   static async deleteFollowees(followerId: Types.ObjectId | string): Promise<void> {
    await FollowerModel.deleteMany({followerId});
  }

  /**
   * Have all the followers of a user unfollow the user
   *
   * @param {string} followeeId - The Id of the followee to delete
   */
   static async deleteFollowers(followeeId: Types.ObjectId | string): Promise<void> {
    await FollowerModel.deleteMany({followeeId});
  }

  // function for getting all the freets of the followees of a user?
  
}

export default FollowerCollection;
