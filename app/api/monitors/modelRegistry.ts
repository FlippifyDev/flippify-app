import { Model } from 'mongoose';

import { Electronics } from './electronicsModel';
import { RetiringSet } from './retiringSetsModel';
import { DealWatch } from './dealWatchModel';
import { RestockInfo } from './restockInfoModel';
import { SneakerReleaseInfo } from './sneakerReleaseInfoModel';
import { Ebay } from './ebayModel';



// Define a type for the model registry with accurate document types
export type ModelRegistry = {
    [key: string]: Model<any>;
  };
  
// Create a model registry with the correct types
export const modelRegistry: ModelRegistry = {
    Ebay,
    Electronics,
    DealWatch,
    RestockInfo,
    SneakerReleaseInfo,
    RetiringSet,
};

