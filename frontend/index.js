import { backend } from "declarations/backend";

const NUTRITIONIX_APP_ID = "YOUR_APP_ID";
const NUTRITIONIX_APP_KEY = "YOUR_APP_KEY";

const foodForm = document.getElementById("foodForm");
const loadingSpinner = document.getElementById("loadingSpinner");
const nutritionInfo = document.getElementById("nutritionInfo");
const nutritionDetails = document.getElementById("nutritionDetails");
const foodLog = document.getElementById("foodLog");

async function getNutritionData(query) {
    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_APP_KEY,
        },
        body: JSON.stringify({
            query: query,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch nutrition data");
    }

    return response.json();
}

async function displayNutritionInfo(foodData) {
    const food = foodData.foods[0];
    const nutritionHTML = `
        <div class="nutrition-item">
            <p><strong>Food:</strong> ${food.food_name}</p>
            <p><strong>Calories:</strong> ${food.nf_calories.toFixed(1)}</p>
            <p><strong>Protein:</strong> ${food.nf_protein.toFixed(1)}g</p>
            <p><strong>Carbohydrates:</strong> ${food.nf_total_carbohydrate.toFixed(1)}g</p>
            <p><strong>Fat:</strong> ${food.nf_total_fat.toFixed(1)}g</p>
        </div>
    `;
    nutritionDetails.innerHTML = nutritionHTML;
    nutritionInfo.classList.remove("d-none");

    // Store in backend
    await backend.addFoodEntry({
        name: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbs: food.nf_total_carbohydrate,
        fat: food.nf_total_fat,
        timestamp: Date.now(),
    });

    await updateFoodLog();
}

async function updateFoodLog() {
    const entries = await backend.getFoodEntries();
    const logHTML = entries.length === 0 
        ? "<p>No foods logged today</p>"
        : entries.map(entry => `
            <div class="food-log-item mb-2">
                <strong>${entry.name}</strong> - 
                ${entry.calories.toFixed(1)} cal, 
                ${entry.protein.toFixed(1)}g protein, 
                ${entry.carbs.toFixed(1)}g carbs, 
                ${entry.fat.toFixed(1)}g fat
            </div>
        `).join("");
    
    foodLog.innerHTML = logHTML;
}

foodForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const foodInput = document.getElementById("foodInput");
    const query = foodInput.value.trim();

    if (!query) return;

    loadingSpinner.classList.remove("d-none");
    nutritionInfo.classList.add("d-none");

    try {
        const nutritionData = await getNutritionData(query);
        await displayNutritionInfo(nutritionData);
    } catch (error) {
        alert("Error fetching nutrition data. Please try again.");
        console.error(error);
    } finally {
        loadingSpinner.classList.add("d-none");
        foodInput.value = "";
    }
});

// Initial food log load
updateFoodLog();
