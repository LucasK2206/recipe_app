async function getRandomMeal(){
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const responseRandomMeal = await request.json();
    console.log(responseRandomMeal);
}
getRandomMeal();

async function getMealByName(){
    const request = await fetch("www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
    const responseRandomMeal = await request.json();
    console.log(responseRandomMeal)
}
async function getMealById(){
    const request = await fetch("www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
    const responseRandomMeal = await request.json();
    console.log(responseRandomMeal);
}