import type {HydratedDocument, Types} from 'mongoose';
import type {Endorse} from './model';
import UserCollection from '../user/collection';
import EndorseModel from './model';

class EndorseCollection {
/**
   * Add an endorsement to the collection
   *
   * @param {string} endorserId - The id of the user who made the endorsement
   * @param {string} freetId - The id of the freet to endorse
   * @return {Promise<HydratedDocument<Endorse>>} - The newly created endorsement
   */
 static async addOne(endorserId: Types.ObjectId | string, freetId: string): Promise<HydratedDocument<Endorse>> {
    const endorse = new EndorseModel({
      endorserId,
      freetId,
    });
    await endorse.save();
    return (await endorse.populate('endorserId')).populate('freetId');
  }

  /**
   * Find an endorsement by the endorser and the freet endorsed
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Endorse>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(endorserId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Endorse>> {
    return EndorseModel.findOne({endorserId, freetId}).populate('endorserId').populate('freetId');
  }

  /**
   * Get all the endorsers of a single freet
   *
   * @return {Promise<HydratedDocument<Endorse>[]>} - An array of all of the endorsements
   */
  static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Endorse>>> {
    return EndorseModel.find({freetId}).populate('endorserId').populate('freetId');
  }

  /**
   * Get all the freets in by given endorser
   *
   * @param {string} username - The username of endorser of the freets
   * @return {Promise<HydratedDocument<Endorse>[]>} - An array of all of the endorsement
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Endorse>>> {
    const endorser = await UserCollection.findOneByUsername(username);
    return EndorseModel.find({endorserId: endorser._id}).populate('endorserId').populate('freetId');
  }

  /**
   * Delete an endorsement from the freet with freetId made by user with userId.
   *
   * @param {string} userId - The userId of the endorser
   * @param {string} freetId - The freetId of freet endorsed by the user
   * @return {Promise<Boolean>} - true if the endorsement has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId, freetId: Types.ObjectId | string): Promise<boolean> {
    const endorsement = await EndorseModel.deleteOne({endorserId: userId, freetId});
    return endorsement !== null;
  }

  /**
   * Delete all the endorsements by the given username
   *
   * @param {string} userId - The id of user
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await EndorseModel.deleteMany({endorserId: userId});
  }
}

export default EndorseCollection;