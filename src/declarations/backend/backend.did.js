export const idlFactory = ({ IDL }) => {
  const FoodEntry = IDL.Record({
    'fat' : IDL.Float64,
    'carbs' : IDL.Float64,
    'calories' : IDL.Float64,
    'name' : IDL.Text,
    'timestamp' : IDL.Int,
    'protein' : IDL.Float64,
  });
  return IDL.Service({
    'addFoodEntry' : IDL.Func([FoodEntry], [], []),
    'getFoodEntries' : IDL.Func([], [IDL.Vec(FoodEntry)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
