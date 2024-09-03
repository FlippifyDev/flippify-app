import { Model } from 'mongoose';

import { RetiringSet, IRetiringSet } from './retiringSetsModel';
import { Electronics, IElectronics } from './electronicsModel';



// Define a type for the model registry with accurate document types
export type ModelRegistry = {
    [key: string]: Model<any>;
  };
  
// Create a model registry with the correct types
export const modelRegistry: ModelRegistry = {
    RetiringSet,
    Electronics,
};

