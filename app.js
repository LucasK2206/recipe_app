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
    const mealSectionToAdd = document.createElement("article");
    mealSectionToAdd.classList.add("container__recipe");
    mealSectionToAdd.setAttribute("title",`${idMeal}`);
    if(sectionName === containerRandomRecipe || sectionName === searchSection){
        mealSectionToAdd.classList.add("indelible");
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
                <h2 class="recipe__description">Description</h2>

                Składniki:

                200g makaronu spaghetti
                1 cebula
                2 ząbki czosnku
                3 łyżki oliwy z oliwek
                puszka pokrojonych pomidorów w sosie pomidorowym
                zioła (oregano, majeranek, bazylia)
                sól
                pieprz
                parmezan
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
        // mealSectionToAdd.addEventListener("click", (meal) => {
        //     meal.target.id = idMeal;
        //     const mealTargetId = meal.target.id
        //     getMealById(mealTargetId).then(response => {
        //         const result = response[0];
        //         if(localStorage.getItem(mealTargetId)  === null ){
        //             localStorage.setItem(mealTargetId, JSON.stringify(result));
        //             createArticleComponent(containerFav, idMeal, strMeal, strMealThumb);

        //             console.log("elo")
        //         } else if(localStorage.getItem(mealTargetId)  !== null){
        //             localStorage.removeItem(mealTargetId);
        //             const getItemId = document.getElementById(`${idMeal}`);
        //             getItemId.remove();

        //         }
        //     });
        // })
const handleFavBtnClick = function(){
    const mealArticle = this.parentNode.parentNode;
    const mealTargetTitle = this.parentNode.parentNode.title;
    getMealById(mealTargetTitle).then((response) => {
        const result = response[0];
        const {idMeal, strMeal, strMealThumb} = result;

        if(Boolean(localStorage.getItem(mealTargetTitle))  === false ){
            localStorage.setItem(mealTargetTitle, JSON.stringify(result));
            createArticleComponent(containerFav, idMeal, strMeal, strMealThumb);
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
    const recipeDiv = this.parentNode.nextElementSibling;
    recipeDiv.classList.toggle("active")
}


const getElementsFromLs = function() {
    for(let i=0; localStorage.length > i; i++){
        const mealKey = localStorage.key(i);
        const getMealContentFromLs = JSON.parse(localStorage.getItem(mealKey));
        const {idMeal, strMeal, strMealThumb} = getMealContentFromLs;
        createArticleComponent(containerFav, idMeal, strMeal, strMealThumb);
    }
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
                        if(result){
                            for (const key of result){
                                const {idMeal, strMeal, strMealThumb} = key
                                addSearchListToHtml(idMeal, strMeal, strMealThumb);
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