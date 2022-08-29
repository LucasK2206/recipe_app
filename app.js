const getMagnifierIcon = document.querySelector(".navigation__search--icon");
const nav = document.querySelector(".navigation__search");
const containerRandomRecipe = document.querySelector(".containerRand");
const searchBox = document.querySelector(".navigation__search--input");
const searchSection = document.querySelector(".containerSearch");
const ulList = document.querySelector(".navigation__list");
const containerFav = document.querySelector(".containerFav");

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
    const {idMeal, strMeal, strMealThumb, ...rest} = randomMeal;
    addBlockToHtml(idMeal, strMeal, strMealThumb, rest);
}
startAsyncFunc();
const createArticleComponent = function(sectionName, idMeal, strMeal, strMealThumb, rest){

    console.log(rest)
    const mealSectionToAdd = document.createElement("article");
    mealSectionToAdd.classList.add("container__recipe");
    mealSectionToAdd.setAttribute("title",`${idMeal}`);
    if(sectionName === containerRandomRecipe || sectionName === searchSection){
        mealSectionToAdd.classList.add("indelible");
    }
   for(let i=1; i<=20; i++){
        if(rest["strIngredient"+i] !== ""){
            console.log(`${rest["strIngredient"+i]} : ${rest["strMeasure"+i]}`)
        }
   }
   const ingredientsTab = [];
    for(let i=1; i<=20; i++){
        if(rest["strIngredient"+i]){
            const singleIngredient = `${rest["strIngredient"+i]} : ${rest["strMeasure"+i]}`;
            ingredientsTab.push(singleIngredient);
        }
    }


    mealSectionToAdd.innerHTML =  `
                <h1 class="container__recipe--name">${strMeal}</h1>

                <div class="container__recipe--img">
                    <img src="${strMealThumb}" alt="">
                </div>

                <div class="buttons">
                    <button class="buttons__fav">Add to fav</button>
                    <button class="buttons__show"></button>
                </div>
                <div class="recipe">
                <h2 class="recipe__header">How to prepare:</h2>
                <span class="recipe__description">${rest.strInstructions}</span>

                <h2 class="recipe__header">Ingredients:</h2>
                ${
                    ingredientsTab.map(ingredient =>
                        `<span class="recipe__description">${ingredient}</span><br>`
                    ).join(" ")
                }
                </div>
            `

        sectionName.append(mealSectionToAdd);

        const getFavBtnFromArticle =  mealSectionToAdd.children[2].children[0];
        const getShowBtnFromArticle = mealSectionToAdd.children[2].children[1];

        if(!mealSectionToAdd.classList.contains("indelible")){
            getFavBtnFromArticle.innerHTML = "Remove";
        }

        getFavBtnFromArticle.addEventListener("click", handleFavBtnClick)
        getShowBtnFromArticle.addEventListener("click", handleShowBtnClick)
}

const handleFavBtnClick = function(){
    const mealArticle = this.parentNode.parentNode;
    const mealTargetTitle = this.parentNode.parentNode.title;
    getMealById(mealTargetTitle).then((response) => {
        const result = response[0];
        const {idMeal, strMeal, strMealThumb, ...rest} = result;

        if(Boolean(localStorage.getItem(mealTargetTitle))  === false ){
            localStorage.setItem(mealTargetTitle, JSON.stringify(result));
            createArticleComponent(containerFav, idMeal, strMeal, strMealThumb, rest);
            console.log("add")
            console.dir(this)

        } else if(Boolean(localStorage.getItem(mealTargetTitle)) && !mealArticle.classList.contains("indelible")){
            localStorage.removeItem(mealTargetTitle);
            console.log("remove");
            mealArticle.parentElement.removeChild(mealArticle)
        }
    })
}
const handleShowBtnClick = function() {
    this.classList.toggle("btn-show-active");
    const recipeDiv = this.parentNode.nextElementSibling;
    recipeDiv.classList.toggle("recipe-active")
}

const getElementsFromLs = function() {
    for(let i=0; localStorage.length > i; i++){
        const mealKey = localStorage.key(i);
        const getMealContentFromLs = JSON.parse(localStorage.getItem(mealKey));
        const {idMeal, strMeal, strMealThumb, ...rest} = getMealContentFromLs;
        createArticleComponent(containerFav, idMeal, strMeal, strMealThumb, rest);
    }
}

const addBlockToHtml = function(idMeal, strMeal, strMealThumb, rest){
    containerRandomRecipe.innerHTML = "Random Recipe";
    createArticleComponent(containerRandomRecipe, idMeal , strMeal, strMealThumb, rest);
}

const addSearchListToHtml = function(idMeal, strMeal, strMealThumb, rest){

    const listItemElement = document.createElement("li");
    listItemElement.addEventListener("click", () => {
        searchSection.innerHTML = "Search dish"
        createArticleComponent(searchSection, idMeal , strMeal, strMealThumb, rest);
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
                        if(result){
                            for (const key of result){
                                const {idMeal, strMeal, strMealThumb, ...rest} = key
                                addSearchListToHtml(idMeal, strMeal, strMealThumb, rest);
                            }
                        }
                    },
                    (reject) => {
                        console.log(reject)
                    }
                );
            } else if (name === " " || name === "" || name.length < 2){
                ulList.innerHTML = "";
            }
        }
    }, 300);
}