import { Model } from 'mongoose';

import { RetiringSet } from './retiringSetsModel';
import { Electronics } from './electronicsModel';
import { Ebay } from './ebayModel';



// Define a type for the model registry with accurate document types
export type ModelRegistry = {
    [key: string]: Model<any>;
  };
  
// Create a model registry with the correct types
export const modelRegistry: ModelRegistry = {
    Ebay,
    RetiringSet,
    Electronics,
};

