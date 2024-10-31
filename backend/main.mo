import Float "mo:base/Float";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

actor {
    // Type definition for food entries
    public type FoodEntry = {
        name: Text;
        calories: Float;
        protein: Float;
        carbs: Float;
        fat: Float;
        timestamp: Int;
    };

    // Buffer to store food entries
    private stable var foodEntries : [FoodEntry] = [];
    private let entriesBuffer = Buffer.Buffer<FoodEntry>(0);

    // Initialize buffer with stable storage
    private func init() {
        for (entry in foodEntries.vals()) {
            entriesBuffer.add(entry);
        };
    };
    init();

    // Add a new food entry
    public shared func addFoodEntry(entry: FoodEntry) : async () {
        entriesBuffer.add(entry);
        foodEntries := Buffer.toArray(entriesBuffer);
    };

    // Get all food entries
    public query func getFoodEntries() : async [FoodEntry] {
        Buffer.toArray(entriesBuffer)
    };

    // System functions for upgrades
    system func preupgrade() {
        foodEntries := Buffer.toArray(entriesBuffer);
    };

    system func postupgrade() {
        init();
    };
}
