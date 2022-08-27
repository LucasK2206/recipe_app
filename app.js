const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");
const searchBox = document.querySelector(".navigation__search--input");
const searchSection = document.querySelector(".containerSearch");
const ulList = document.querySelector(".navigation__list");
const containerFav = document.querySelector(".containerFav");
console.log(containerFav)
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
    searchBox.addEventListener("input", searchLetterWrote);
    getElementsFromLs();
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
const getMealById = async function(mealId){
    const request = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId);
    const responseMealById = await request.json();
    const mealByItemId = await responseMealById.meals;
    return mealByItemId;
}
const startAsyncFunc = async function(){

    const randomMeal = await getRandomMeal();
    const {idMeal, strMeal, strMealThumb} = randomMeal;
    addBlockToHtml(idMeal, strMeal, strMealThumb);
}
startAsyncFunc();
const createArticleComponent = function(sectionName, idMeal, strMeal, strMealThumb){
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
            console.log(sectionName, randomMealSection)
        sectionName.append(randomMealSection);
        randomMealSection.addEventListener("click", (meal) => {
            meal.target.id = idMeal;
            const mealTargetId = meal.target.id
            getMealById(mealTargetId).then(response => {
                const result = response[0];
                if(localStorage.getItem(mealTargetId)  === null ){
                    localStorage.setItem(mealTargetId, JSON.stringify(result));

                    // const getMealContentFromLs = JSON.parse(localStorage.getItem(mealTargetId));
                    // const {idMeal, strMeal, strMealThumb} = getMealContentFromLs;
                    // createArticleComponent("Fav dishes", containerFav, idMeal, strMeal, strMealThumb)
                } else {
                    localStorage.removeItem(mealTargetId);
                }
            });
        })
}
const getElementsFromLs = function() {
    for(let i=0; localStorage.length > i; i++){
        const mealKey = localStorage.key(i);
        const getMealContentFromLs = JSON.parse(localStorage.getItem(mealKey));
        const {idMeal, strMeal, strMealThumb} = getMealContentFromLs;
        createArticleComponent(containerFav, idMeal, strMeal, strMealThumb);
    }
    const favBtn = document.querySelector(".buttons__fav");
    favBtn.addEventListener("click", (meal) => {
    })
}

const addBlockToHtml = function(idMeal, strMeal, strMealThumb){
    containerRandomRecipe.innerHTML = "Random Recipe";
    createArticleComponent(containerRandomRecipe, idMeal , strMeal, strMealThumb);
}

const addSearchListToHtml = function(idMeal, strMeal, strMealThumb){

    const listItemElement = document.createElement("li");
    listItemElement.addEventListener("click", () => {
        searchSection.innerHTML = "Search dish"
        createArticleComponent(searchSection, idMeal , strMeal, strMealThumb);
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
                        for (const key of result){
                            const {idMeal, strMeal, strMealThumb} = key
                            addSearchListToHtml(idMeal, strMeal, strMealThumb);
                        }
                    }
                );
            } else if (name === " " || name === "" || name.length < 2){
                ulList.innerHTML = "";
            }
        }
    }, 300);
}