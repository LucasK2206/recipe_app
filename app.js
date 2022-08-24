const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");
const searchBox = document.querySelector(".navigation__search--input");
const searchSection = document.querySelector(".containerSearch");
const ulList = document.querySelector(".navigation__list");
document.addEventListener("DOMContentLoaded", () => {
    addEventListeners();
})
const addEventListeners = function(){
    getMagnifierIcon.addEventListener("click", handleMagnifierClick);
    searchBox.addEventListener("focus", () => {
        setTimeout(() => {
            ulList.classList.toggle("navigation__list--disabled");
        }, 100);
    })
    searchBox.addEventListener("blur", () => {
        setTimeout(() => {
            ulList.classList.toggle("navigation__list--disabled");
        }, 100);
    })
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
    searchBox.innerHTML = "";
    ulList.innerHTML = "";
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=%${mealName}%`);
    const responseMealByName = await request.json();
    const mealByNameItem = await responseMealByName.meals;
    return mealByNameItem;
}
const getMealById = async function(){
    const request = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=5555");
    const responseMealById = await request.json();
    const mealByItemId = await responseMealById.meals;
    return mealByItemId;

}

const startAsyncFunc = async function(){

    const randomMeal = await getRandomMeal();
    const mealById = await getMealById();
    const {strMeal, strMealThumb} = randomMeal;
    addBlockToHtml(strMeal, strMealThumb);
}
startAsyncFunc();
const createArticleComponent = function(containerTitle, sectionName, strMeal, strMealThumb){
    const randomMealSection = document.createElement("article");
    randomMealSection.classList.add("container__recipe");
    sectionName.innerHTML = `<h1 class="container__title">${containerTitle}</h1>`
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
    const favBtn = document.querySelector(".buttons__fav");
    favBtn.addEventListener("click", (box) => {
        box.target.id = strMeal;
        console.log(box.target.id)
    })
}
const addBlockToHtml = function(strMeal, strMealThumb){
    const containerTitle = "Random dish";
    createArticleComponent(containerTitle, containerRandomRecipe, strMeal, strMealThumb);
}

const addSearchListToHtml = function(idMeal, strMeal, strMealThumb){

    const listItemElement = document.createElement("li");
    listItemElement.addEventListener("click", () => {
        const containerTitle = "Search dish";
        createArticleComponent(containerTitle, searchSection, strMeal, strMealThumb);
        //createArticleComponent(searchBox)
    })
    listItemElement.classList.add("navigation__list--item");
    listItemElement.value = strMeal
    listItemElement.innerHTML = `${strMeal}`;
    ulList.append(listItemElement);

}

const searchLetterWrote = function(){
    const checkName = searchBox.value;
    setTimeout(() => {
        const name = searchBox.value;
        if(checkName === name){
            if(name !== " " && name !== "" && name.length >= 2){
                getMealByName(name).then(
                    (result) => {
                        console.log(result)
                        for (const key of result){
                            const {idMeal, strMeal, strMealThumb} = key
                            addSearchListToHtml(idMeal, strMeal, strMealThumb);
                        }
                    }
                );
                console.log(name)
            } else if (name === " " || name === "" || name.length < 2){
                ulList.innerHTML = "";
            }
        }
    }, 300);
}