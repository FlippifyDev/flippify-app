import { Model } from 'mongoose';

import { Electronics } from './electronics';
import { RetiringSet } from './retiringsets';
import { DealWatch } from './dealwatch';
import { RestockInfo } from './restockinfo';
import { SneakerReleaseInfo } from './sneakerreleaseinfo';
import { Ebay } from './ebay';


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