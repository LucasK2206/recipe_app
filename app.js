const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");
const searchBox = document.querySelector(".navigation__search--input");

document.addEventListener("DOMContentLoaded", () => {
    addEventListeners();
})
const addEventListeners = function(){
    getMagnifierIcon.addEventListener("click", handleMagnifierClick);
    searchBox.addEventListener("input", searchLetterWrote)
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

const getMealByName = async function(mealName){
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=%${mealName}%`);
    const responseMealByName = await request.json();
    const mealByNameItem = await responseMealByName.meals;
    console.log(mealByNameItem)
    return mealByNameItem;
}
const getMealById = async function(){
    const request = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772");
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
startAsyncFunc();
const createArticleComponent = function(strMeal, strMealThumb){
    return `
                <h1 class="container__recipe--name">${strMeal}</h1>

                <div class="container__recipe--img">
                    <img src="${strMealThumb}" alt="">
                </div>

                <div class="buttons">
                    <button class="buttons__fav">Add to fav</button>
                    <button class="buttons__show"></button>
                </div>
            `
}
const addRandomDivToHtml = function(randomMeal){
    const {strMeal, strMealThumb} = randomMeal;
    console.log(strMeal, strMealThumb);
    const randomMealSection = document.createElement("article");
    randomMealSection.classList.add("container__recipe");
    randomMealSection.innerHTML = createArticleComponent(strMeal, strMealThumb);
    containerRandomRecipe.append(randomMealSection);
}
const searchLetterWrote = function(){
    setTimeout(() => {
        const name = searchBox.value;
        getMealByName(name)
    }, 300);
}