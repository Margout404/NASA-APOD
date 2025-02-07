const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");




//nasa apod api
const count= 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page){
    window.scrollTo({top: 0, behavior: 'smooth'});
    if (page === "results"){
        resultsNav.classList.remove("hidden");
        favoritesNav.classList.add("hidden");}
    else{
        resultsNav.classList.add("hidden");
        favoritesNav.classList.remove("hidden");}
    
    loader.classList.add("hidden");
}

function createDOMNodes(page){
    const currentArray = page === "results" ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        //card container
        const card = document.createElement('div');
        card.classList.add("card");
        //link
        const link = document.createElement("a");
        link.href = result.url;
        link.title = result.title;
        link.target = "_blank";
        //img
        const image = document.createElement("img");
        image.src = result.url;
        image.alt = "NASA Picture of the Day";
        image.loading = "lazy";
        image.classList.add("card-img-top");
        //card body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        //card title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = result.title;
        //save text
        const saveText = document.createElement("p");
        saveText.classList.add("clickable")
        if (page === "results"){
            saveText.textContent = "Add to favorites";
            saveText.setAttribute("onclick",`saveFavorite('${result.url}')`)
        }else{
            saveText.textContent = "Remove Favorite";
            saveText.setAttribute("onclick",`removeFavorite('${result.url}')`)

        }
        //card text
        const cardText = document.createElement("p");
        cardText.textContent= result.explanation;
        //footer container
        const footer = document.createElement("small");
        footer.classList.add('text-muted')
        //date
        const date = document.createElement("strong");
        date.textContent=result.date;
        //copyright
        const copyright= document.createElement("span")
        if (result.copyright){
            copyright.textContent = ` ${result.copyright}`;
        }
        //appent to parents
        footer.append(date,copyright);
        cardBody.append(cardTitle,cardText,saveText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card)
})
    
}
function updateDOM(page){
    //get fav from local storage
    if (localStorage.getItem("nasaFavorites")){
        favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    }
    imagesContainer.textContent = "";
    //show results
    createDOMNodes(page);
    showContent(page);
}
//add to fav func
function saveFavorite(itemUrl){
    //select favorites
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            //show save confirmed
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //local storage
            localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        }
        });
};

function removeFavorite(itemUrl){
        if (favorites[itemUrl]){
            delete favorites[itemUrl];
            //local storage
            localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
            updateDOM("favorites");
        }
}

//get 10img from api
async function getNasaPictures() {
    //show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM("results");
    } catch (error) {
        console.log(error,"oops something went wrong");
    }
}

getNasaPictures();