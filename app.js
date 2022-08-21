const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");

document.addEventListener("DOMContentLoaded", () => {
    addEventListeners();
})
const addEventListeners = function(){
    getMagnifierIcon.addEventListener("click", handleMagnifierClick)
}
const handleMagnifierClick = function() {
    nav.classList.toggle("navigation__search--active")
}

const getRandomMeal = async function(){
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const responseRandomMeal = await request.json();
    const randomMealItem = await responseRandomMeal.meals[0];
    return randomMealItem;
}
getRandomMeal();

const getMealByName = async function(){
    const request = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
    const responseMealByName = await request.json();
    const mealByNameItem = await responseMealByName.meals;
    return mealByNameItem;
}
const getMealById = async function(){
    const request = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
    const responseMealById = await request.json();
    const mealByIdItem = await responseMealById.meals;
    return mealByIdItem;

}

const startAsyncFunc = async function(){

    const randomMeal = await getRandomMeal();
    const mealByName = await getMealByName();
    const mealById = await getMealById();
    addRandomDivToHtml(randomMeal);
}
const createArticleComponent = function(strMeal, strMealThumb){
    return `
                <h1 class="containerRand__randRecipe--name">${strMeal}</h1>

                <div class="containerRand__randRecipe--img">
                    <img src="${strMealThumb}" alt="">
                </div>

                <div class="btnBox">
                    <button class="btnBox__favBtn">Add to fav</button>
                    <button class="btnBox__showRecipe"></button>
                </div>
            `
}
const addRandomDivToHtml = function(randomMeal){
    const {strMeal, strMealThumb} = randomMeal;
    console.log(strMeal, strMealThumb);
    const randomMealSection = document.createElement("article");
    randomMealSection.classList.add("containerRand__randRecipe");
    randomMealSection.innerHTML = createArticleComponent(strMeal, strMealThumb);
    containerRandomRecipe.append(randomMealSection);
}
startAsyncFunc();