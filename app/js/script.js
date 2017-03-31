var items = document.getElementById('items');

function ajax(url, fnctn, param) {
	var ajaxRequest = new XMLHttpRequest(); 
	var handleResponse=function(){
		if(ajaxRequest.status===200){
			if(ajaxRequest.readyState===4){
				var films=JSON.parse(ajaxRequest.responseText);
				if (param=="") {
					fnctn(films)
				}else{
					fnctn(films, param);
				}
			}
		}
	}
	ajaxRequest.onreadystatechange=handleResponse; 
	ajaxRequest.open('GET', url, true);
	ajaxRequest.send(null);
} ///ajax Setup with custom paramaters

//function showing all the films
if (document.getElementById('search')) {
	ajax("../json/films.json", showallfilms);
}

var defLa=["<div class='one large-4 small-6 columns' id='film","'><a href='filmdetails.html#","'><img src='../img/","'><div class='details item'><p>","</p><p>Rating:","%</p></div></a></div>"];

//This variable has some code which is used to create each film item on the films page

function showallfilms(films) {
    items.innerHTML = "";
    for (var i=0;i<films.length;i++){
        items.innerHTML += defLa[0] + i + defLa[1] + i + defLa[2] + films[i].image + defLa[3] + " Title: " +films[i].title + " <br>Genre: " + films[i].genre + defLa[4] + films[i].rating + defLa[5];
    }
}



if (document.getElementById('search')) {
	var firstSearch = document.getElementById("search");
	var SecondSearch = document.getElementById("SecondSearch");
	var advanced = document.getElementById('advanced');
	var advancedbtn = document.getElementById('advancedbtn');
	var slider = document.getElementById('ratingDiv');
} //When the user visits the films page the if statement creates the variables above

//The search function searching for film title and genre and ratings
function searchfilm(films){
    items.innerHTML = "";
    var d = false;
    var searchval;
    var searchedFilms = [];
 
    for (var i=0;i<films.length;i++){ // variable is used to stop repeating code
	var content = defLa[0] + i + defLa[1] + i + defLa[2] + films[i].image + defLa[3] + " Title: " +films[i].title + " <br>Genre: " +  films[i].genre + defLa[4] + films[i].rating + defLa[5];
//These If statements are used to see which search is being used either title search, genre search or ratings search
if (firstSearch === document.activeElement){
		searchval = firstSearch.value;
	

		if(films[i].title.toLowerCase().match(searchval.toLowerCase())){//.match() fuction is used with the .search() function because .search() only shows the results with the searched letters at the start
			items.innerHTML += content;
		
			d = true; //If d is true, thish  means that there is some content to show
		}
	}else if (SecondSearch === document.activeElement){
		searchval = SecondSearch.value;
		if(films[i].genre.toLowerCase().match(searchval.toLowerCase())){
			items.innerHTML += content;
			d = true;
			searchedFilms[i]="film"+i;
		}
		if (slider.noUiSlider.get()[0]==10&&slider.noUiSlider.get()[1]==100) {}else{
			filterAndSearch(films, searchedFilms, slider, 1, content);
		} // a jquery slider library called nouislider is used to filter out the films ratings
	}
    }
    
    if(d==false){
        items.innerHTML = "No Results Found"; // if d is false then this error message will be shown as there is no content matching the search inputted
    }
}

//the filter function filters the films according to the ratings
function filter(films, margins) {
	if (margins[0]==10&&margins[1]==100) {
	}else{
		items.innerHTML="";
		var searchedFilms = [];
		var filmRating;
		for (var i=0; i<films.length; i++) {
			var content = defLa[0] + i + defLa[1] + i + defLa[2] + films[i].image + defLa[3] + " Title: " +films[i].title + " <br>Genre: " +  films[i].genre + defLa[4] + films[i].rating + defLa[5];
			filmRating = films[i].rating.replace(".", "");
			filmRating = filmRating.replace(".", "");
			if (filmRating>margins[0]&&filmRating<margins[1]) {
				items.innerHTML += content;
				searchedFilms[i]="film"+i;
			}
		}
		if(SecondSearch.value!="") {
			filterAndSearch(films,SecondSearch.value.toLowerCase(), searchedFilms, 2, content);
		}
		if (items.innerHTML=="") {
			items.innerHTML = "No Results Found";
		}
	}
}

//If both advanced searches so if the user makes a search using Genre and ratings then this function will be called 
function filterAndSearch(films, searched, filtered, num) {
	items.innerHTML = "";
	var arrayOne = [];
	var arrayTwo = [];
	var filmRating;
	for (var i=0; i<films.length; i++) {
		if (num == 2) {
			if(films[i].genre.toLowerCase().match(searched)){
				arrayOne[i]="film"+i;
			}
		}else{
			arrayOne=searched;
		}
		filmRating = films[i].rating.replace(".", "");
		filmRating = filmRating.replace(".", "");
		
		if (filmRating>Math.round(slider.noUiSlider.get()[0])&&filmRating<Math.round(slider.noUiSlider.get()[1])) {
			arrayTwo[i]="film"+ i;
		}
		
		if (arrayOne[i]==undefined && arrayTwo[i]==undefined) {
		}else if (arrayOne[i]==arrayTwo[i]) {
			items.innerHTML += defLa[0] + i + defLa[1] + i + defLa[2] + films[i].image + defLa[3] + " Title: " +films[i].title + " <br>Genre: " + films[i].genre + defLa[4] + films[i].rating + defLa[5];
		}
	}
	if (items.innerHTML == "") {
		items.innerHTML = "No Results Found";
	}
}

function showAdvanced() { //this function is called when the advanced button is pressed which displays text on the button like advanced search and hide advanced search
	if (advanced.className == "advancedshow"){
		advanced.className = "advancedhide";
		advancedbtn.innerHTML = "Advanced Search";
	}else{
		advanced.className = "advancedshow";
		advancedbtn.innerHTML = "Hide Advanced Search";
	}
}

if (document.getElementById('ratingDiv')) { // inside the ratingDiv the nouislider is placed and the default start is 29 which is the lowest rated film, the highest is 97  
	noUiSlider.create(slider, {
		start: [ 29, 97 ],
		connect: true,
		tooltips: [wNumb({ suffix:'%', thousand: '.',decimals: 0 }), wNumb({ suffix:'%', thousand: '.',decimals: 0 })], // wnumb is a jquery library usually used to format javascript numbers and money, in this case it is used to format the ratings numbers in percentages 
		range: {
			'min': 0,
			'max': 100
		} // slider cannot go below 0 or higher than 100
	});
	
	slider.noUiSlider.on('update', function ( values, handle ) {
		var marginMax = slider.noUiSlider.get()[0] ;
		var marginMin = slider.noUiSlider.get()[1] ;
		filterSetup(Math.round(marginMax), Math.round(marginMin));
	});
}

function filterSetup(marginMax,marginMin) {
	var margins = [marginMax, marginMin];
	ajax("../json/films.json", filter, margins);
	
}//This function is used to set up the ajax search and the parameters which it includes

if (document.getElementById('individualFilm')) {
	ajax("../json/films.json", individualFilm);
}

function individualFilm(films){
	var urlHash = location.hash;
	var filmId = urlHash.slice(1);
	//This functions locates the url hash and fetches the data of the film which was clicked

	if (filmId == ""){
		document.getElementById('individualFilm').innerHTML = "<div class='row'><h1>Oops, Looks like something went wrong</h1><h2><a href='films.html'>Click here to go back!</a></h2></div>"; //error message is shown if theres no content
	}
	document.getElementById('filmBreadcrumb').innerHTML = films[filmId].title;
	document.getElementById('filmImg').innerHTML = "<img src='../img/" + films[filmId].image + "'>";
	document.getElementById('filmPlot').innerHTML = films[filmId].plot;
	document.getElementById('filmTitle').innerHTML = films[filmId].title;
	document.getElementById('filmGenre').innerHTML = films[filmId].genre;
	document.getElementById('filmRating').innerHTML = films[filmId].rating+"%" ;
	document.getElementById('filmYear').innerHTML = films[filmId].year;
	document.getElementById('filmsMore').innerHTML = "<h4>Recommended Films:</h4>"; //This code is used to create the films information  on the individual films page, the info from the json file will go into each div
	var e=0;
	for (var i=0; i<14; i++) { //there are 14 films in the json file and this will show 3 of them in the recommended section which can be clicked on
		if (e<3) {
			if (i!=filmId){
				document.getElementById('filmsMore').innerHTML += "<a href='filmdetails.html#" + i + "' onClick='window.location.reload()'><img src='../img/" + films[i].image + "'></a>";
				e++;
				i++;
			}
		}
	}

//the functions below show that when the user clicks add to watchlist it will be stored in the local storage and also when they removeWatch is called the item is removed from the storage

	var watchSpan = document.getElementById("watchSpan");
	watchSpan.innerHTML="<a href='javascript:void(0)' onclick='addWatch("+filmId+")' class='watchLink'>+ Add to Watchlist</a>";
	if (localStorage.getItem("watchlist")) {
		var localWatch = JSON.parse(localStorage.getItem("watchlist"));
		for (var i=0; i<localWatch.length; i++) {
			if (localWatch[i]==filmId) {
				watchSpan.innerHTML="<a href='javascript:void(0)' onclick='removeWatch("+filmId+")' class='watchLink'> - Remove from Watchlist</a>";
			}
		}
	}
	
}


function addWatch(filmId) {
	if (localStorage.getItem("watchlist")) {
		var localWatch = JSON.parse(localStorage.getItem("watchlist"));
		localWatch.push(filmId);
		localStorage.setItem("watchlist", JSON.stringify(localWatch));
	}else{
		var watchlist = [filmId];
		localStorage.setItem("watchlist", JSON.stringify(watchlist));
	}
	location.reload();
}

function removeWatch(filmId) {
	var localWatch = JSON.parse(localStorage.getItem("watchlist"));
	for (var i=0;i<localWatch.length;i++) {
		if (localWatch[i]==filmId) {
			localWatch.splice(i,1);
		}
	}
	localStorage.setItem("watchlist", JSON.stringify(localWatch));
	location.reload();
}
if (document.getElementById("ListWatch")) {
	ajax("../json/films.json", showWatchlist);
	
}

//this function is called when the user visits the watchlist page and it shows the films image and title which can be clicked on
function showWatchlist(films) {
	var localWatch = JSON.parse(localStorage.getItem("watchlist"));
	
	for (var i=0;i<localWatch.length;i++) {
		document.getElementById("ListWatch").innerHTML+="<a href='filmdetails.html#"+localWatch[i]+"'><div class='one large-6 columns'><img class='watchImg' src='../img/"+films[localWatch[i]].image+"'><br><div class='details2'>"+films[localWatch[i]].title+"</div></div></a><br>";
	}
}
