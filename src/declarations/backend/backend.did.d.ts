import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface FoodEntry {
  'fat' : number,
  'carbs' : number,
  'calories' : number,
  'name' : string,
  'timestamp' : bigint,
  'protein' : number,
}
export interface _SERVICE {
  'addFoodEntry' : ActorMethod<[FoodEntry], undefined>,
  'getFoodEntries' : ActorMethod<[], Array<FoodEntry>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
