// Dynamic Card Locations in HTML (Invoked)
var container = document.getElementById('cardsList');
var favContainer = document.getElementById('cardsListFav');

// Main Variables for the Application
let favContent = []
let initialContent = [];
let JsonValue = [];

//Seperating Favorities and Game Lists
function Seperating(api) {

    var apiResult = JSON.parse(api)
    JsonValue = apiResult;
    apiResult.forEach((result) => {

        if (result.isFav) {

            favContent.push(result);
        }
        else {
            initialContent.push(result);
        }
    })

    //Jquery for adding Mouse Hover Play to videos (trailers)
    if (apiResult.length > 0) {
        $(document).ready(function () {
            $(".vid").on("mouseover", function (e) {
                this.play()
            }).on('mouseout', function (event) {
                this.pause();

            });
        })
    }

    initialCardCreation();
    favCardCreation();
    
}

// Intial or Main Page Card Creation (Dynamic)
function initialCardCreation() {

    let initial = document.getElementById("notFoundInitial"); // Used For 'No Games Found' when no games in DB

    if (initialContent.length == 0) {
        if (favContent.length > 0) {
            initial.innerText = "You Got Games in Fav's"
        }
        else {
            initial.style = "display : ;";

        }
    }
    else {
        initial.style = "display: none;";
        initialContent.forEach((card) => {
            const cardElement = `
                <div class="column">
                    <div class="card">
                        <video src="${card.trailer}" muted="muted" class = "vid"></video>
                        <h5 class = "name">${card.name}</h5>
                        <p>${card.description}</p> 
                        <div class="CardBottom">
                            <h5 class = "year">year: ${card.year}</h5>
                            <h5 class = "age">Age: ${card.eligibility}</h5>
                            <h5 class = "genre">Genre: ${card.genre} </h5>
                            <h5 class = "price">Price: ${card.price} </h5>
                            <h5 class = "size">Size: ${card.size} </h5>
                            <div class="combine">
                                <span onclick="MoveList(this)" class = "toFavSection" value="a">
                                    <i class="material-icons">favorite</i>
                                </span>
                                <span onclick="DeleteList(this)">
                                    <i class="material-icons">delete</i>
                                </span>
                            </div>
                                
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardElement;
        })
    }
}

// Favorites Page Card Creation (Dynamic)
function favCardCreation() {

    let fav = document.getElementById("notFoundFav"); // Used For 'No Games Found' when no games in DB
    if (favContent.length == 0) {
        if (initialContent.length > 0) {
            fav.innerText = "You Got games in GameList, why wait add them as Fav's"
        }
        else {
            fav.style = "display : ;";

        }
    }
    else {
        fav.style = "display: none;";
        favContent.forEach((card) => {
            const cardElement = `
                <div class="column">
                    <div class="card" style="background-color: #455561">
                
                        <video src="${card.trailer}" muted="muted" class = "vid"></video>
                        <h5 class = "name">${card.name}</h4>
                        <p>${card.description}</p> 
                        <div class="CardBottom">
                    
                            <h5 class = "year">Year: ${card.year}</h3>
                            <h5 class = "age">Age: ${card.eligibility}</h5>
                            <h5 class = "genre">Genre: ${card.genre} </h5>
                            <h5 class = "price">Price: ${card.price} </h5>
                            <h5 class = "size">Size: ${card.size} </h5>
                            <div class="combine">
                                <span onclick="MoveList(this)" class="toFavSection">
                                    <i class="material-icons" style="color: green;">favorite</i>
                                </span>
                                <span onclick="DeleteList(this)" class="toFavSection">
                                    <i class="material-icons">delete</i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            favContainer.innerHTML += cardElement;
        })
    }

}



//Drop Down
let DropdownValue = "name";
function Options() {
    element = document.querySelector("#ChooseFilter");
    output = element.value;
    DropdownValue = output;
}

//Search Module (For all categories) (Dynamic)
function Search() {
    let input = document.getElementById("filter").value.toLowerCase();
    let cardContainer = document.getElementById("row");
    let cards = document.getElementsByClassName("column");
    for (let i = 0; i < cards.length; i++) {
        var sample = cards[i].querySelector("." + DropdownValue).innerText.toLowerCase();
        if (sample.indexOf(input) > -1) {
            cards[i].style.display = "";

        }
        else {
            cards[i].style.display = "none";
        }
    }
}

//Move List (From GameList to Favorites and vice versa)
function MoveList(e) {
    let cardTitle = e.parentNode.parentNode.previousElementSibling.previousElementSibling.innerText;
    for (var i = 0; i < JsonValue.length; i++) {
        if (JsonValue[i].name === cardTitle) {
            Update(JsonValue[i].name, JsonValue[i].isFav, JsonValue[i].year)
            break;
        }

    }
}

// Remove Games from the application
function DeleteList(e) {
    if (window.confirm("Do you really want to delete?")) {
        let cardTitle = e.parentNode.parentNode.previousElementSibling.previousElementSibling.innerText;
        for (var i = 0; i < JsonValue.length; i++) {
            if (JsonValue[i].name === cardTitle) {
                Delete(JsonValue[i].name, JsonValue[i].year);
                break;
            }
        }
    }
    else {
        alert("Cancelled");
    }
}

// Insert new games (Popup UI)
var model = document.getElementById("NewGameModel")
var modelButton = document.getElementById("addButton");
var span = document.getElementsByClassName("close")[0];

modelButton.onclick = function () {
    model.style.display = "block";
}
span.onclick = function () {
    model.style.display = "none";
}
window.onclick = function (e) {
    if (e.target == model) {
        model.style.display = "none";
    }
}

// ---- Api Calls Start ---- //

// Insert
function PostDetails() {
    
    let name = document.getElementById("Name").value;
    let price = document.getElementById("Price").value;
    let year = document.getElementById("Year").value;
    let eligibility = document.getElementById("Eligibility").value;
    let genre = document.getElementById("Genre").value;
    let trailer = document.getElementById("Trailer").value;
    let size = document.getElementById("Size").value;
    let description = document.getElementById("Description").value;

    if((name == null || name == "") || (price == null || price == "") 
        || (year == null || year == "") || (eligibility == null || eligibility == "") 
        || (genre == null || genre == "") || (trailer == null || trailer == "") 
        || (size == null || size == "") || (description == null || description == "")){

            alert("Please Fill In All Required Fields");
    }
    else{
        document.getElementById("SubmitButton").disabled = true;
        var json = {
            "name": name,
            "price": price,
            "year": year,
            "eligibility": eligibility,
            "genre": genre,
            "trailer": trailer,
            "size": size,
            "description": description,
            "isFav": false
        }
        let data = JSON.stringify(json);
        const url = "https://presidio-console-based-games-list-application-backend.vercel.app/insert";
        let requestPost = new XMLHttpRequest();
    
        requestPost.open('POST', url, true);
        requestPost.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        requestPost.send(data);
        requestPost.onload = function () {
            if (requestPost.status === 200) {
                alert("Data posted successfully!");
                document.getElementById("Name").value = "";
                document.getElementById("Price").value = "";
                document.getElementById("Year").value = "";
                document.getElementById("Eligibility").value = "";
                document.getElementById("Genre").value = "";
                document.getElementById("Trailer").value = "";
                document.getElementById("Size").value = "";
                document.getElementById("Description").value = "";
                document.getElementById("SubmitButton").disabled = false;
                Get();
            }
        }
    }
    
}

// Get
function Get() {
    AmagiLoader.show();
    document.getElementById("cardsList").innerHTML = "";
    document.getElementById("cardsListFav").innerHTML = "";
    
    var request = new XMLHttpRequest();
    request.onload = function () {

        favContent = []
        initialContent = []
        JsonValue = []
        
        Seperating(this.responseText);
        setTimeout(() => {
            AmagiLoader.hide();
         }, 3000);
        
    }
    request.open('GET', "https://presidio-console-based-games-list-application-backend.vercel.app/get", true);
    request.send();
}

// Update
function Update(name, present, year) {
    let to_update = false;
    if (present) {
        to_update = false;
    }
    else {
        to_update = true;
    }
    var json = {
        "name": name,
        "isFav": to_update,
        "year": year

    }

    let data = JSON.stringify(json);
    const url = "https://presidio-console-based-games-list-application-backend.vercel.app/update";
    let requestUpdate = new XMLHttpRequest();

    requestUpdate.open('PUT', url, true);
    requestUpdate.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    requestUpdate.send(data);
    requestUpdate.onload = function () {
        if (requestUpdate.status === 200) {
            alert("Data Moved successfully!");
            Get();
        }
    }
}

// Delete
function Delete(name, year) {
    var json = {
        "name": name,
        "year": year,
    }

    let data = JSON.stringify(json);
    const url = "https://presidio-console-based-games-list-application-backend.vercel.app/del";
    let requestDelete = new XMLHttpRequest();

    requestDelete.open('DELETE', url, true);
    requestDelete.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    requestDelete.send(data);
    requestDelete.onload = function () {
        if (requestDelete.status === 200) {
            alert("Data Deleted successfully!");
            Get();
        }
    }
}

// ---- Api Calls Ends ---- //