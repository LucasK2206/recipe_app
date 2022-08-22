const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");
const searchBox = document.querySelector(".navigation__search--input");
const searchSection = document.querySelector(".containerSearch");

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
    searchSection.innerHTML = "";
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=%${mealName}%`);
    const responseMealByName = await request.json();
    const mealByNameItem = await responseMealByName.meals;
    for (const key of mealByNameItem){
        console.log(key);
        const {strMeal, strMealThumb} = key
        addSearchDivToHtml(strMeal, strMealThumb);
    }
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
    const mealById = await getMealById();
    const {strMeal, strMealThumb} = randomMeal;
    addRandomDivToHtml(strMeal, strMealThumb);
}
startAsyncFunc();
const createArticleComponent = function(strMeal, strMealThumb, sectionName){
    const randomMealSection = document.createElement("article");
    randomMealSection.classList.add("container__recipe");

    randomMealSection.innerHTML =  `
                <h1 class="container__recipe--name">${strMeal}</h1>

                <div class="container__recipe--img">
                    <img src="${strMealThumb}" alt="">
                </div>

                <div class="buttons">
                    <button class="buttons__fav">Add to fav</button>
                    <button class="buttons__show"></button>
                </div>
            `
    sectionName.append(randomMealSection);
}
const addRandomDivToHtml = function(strMeal, strMealThumb){
    createArticleComponent(strMeal, strMealThumb, containerRandomRecipe);
}
const addSearchDivToHtml = function (strMeal, strMealThumb){
    createArticleComponent(strMeal, strMealThumb, searchSection)
}
const searchLetterWrote = function(){
    setTimeout(() => {
        const name = searchBox.value;
        console.log(name.length)
        if(name !== " " && name !== "" && name.length >= 2){
            getMealByName(name);
        }
    }, 300);
}