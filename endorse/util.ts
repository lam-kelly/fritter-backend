import type {HydratedDocument} from 'mongoose';
import type {Endorse, PopulatedEndorse} from './model';

type EndorseResponse = {
  _id: string;
  endorser: string;
  freet: string;
};

/**
 * Transform a raw Endorse object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Endorse>} endorsement - A Endorse object
 * @returns {EndorserResponse} - A copy of the Endorse object
 */
const constructEndorseResponse = (endorsement: HydratedDocument<Endorse>): EndorseResponse => {
  const endorseCopy: PopulatedEndorse = {
    ...endorsement.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = endorseCopy.endorserId;
  const {_id} = endorseCopy.freetId;

  return {
    _id: endorseCopy._id.toString(),
    endorser: username,
    freet: _id.toString()
  };
};

export {
  constructEndorseResponse as constructEndorseResponse
};
