//--------SERVER_ACCES.JS STARTS HERE ----


function createXmlHttp() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!(xmlhttp)) {
        alert("Your browser does not support AJAX!");
    }
    return xmlhttp;
}

// this function converts a simple key-value object to a parameter string.
function objectToParameters(obj) {
    var text = '';
    for (var i in obj) {
        // encodeURIComponent is a built-in function that escapes to URL-safe values
        text += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
    }
    return text;
}


function postParameters(xmlHttp, target, parameters) {
    if (xmlHttp) {
        xmlHttp.open("POST", target, true); // XMLHttpRequest.open(method, url, async)
        var contentType = "application/x-www-form-urlencoded";
        xmlHttp.setRequestHeader("Content-type", contentType);
        xmlHttp.send(parameters);
    }
}

function sendJsonRequest(parameterObject, targetUrl, callbackFunction) {
    var xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, parameterObject);
        }
    }
    postParameters(xmlHttp, targetUrl, objectToParameters(parameterObject));
}

function get(xmlHttp, target) {
    if (xmlHttp) {
        xmlHttp.open("GET", target, true); // XMLHttpRequest.open(method, url, async)
        var contentType = "application/x-www-form-urlencoded";
        xmlHttp.setRequestHeader("Content-type", contentType);
        xmlHttp.send();
    }
}

function sendGetRequest(targetUrl, callbackFunction) {
    var xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl);
        }
    }
    get(xmlHttp, targetUrl)
}






//-------END OF SERVER_ACCESS.JS





// This can load data from the server using a simple GET request.
function getData(targetUrl, callbackFunction) {
    let xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            // note that you can check xmlHttp.status here for the HTTP response code
            try {
                let myObject = JSON.parse(xmlHttp.responseText);
                callbackFunction(myObject, targetUrl);
            } catch (exc) {
                console.log("There was a problem at the server.");
            }
        }
    }
    xmlHttp.open("GET", targetUrl, true);
    xmlHttp.send();
}


function showError(msg) {
    let errorAreaDiv = document.getElementById('ErrorArea');
    errorAreaDiv.display = 'block';
    errorAreaDiv.innerHTML = msg;
}


function hideError() {
    let errorAreaDiv = document.getElementById('ErrorArea');
    errorAreaDiv.display = 'none';
}

//edited into garage CALLBACKFUNCTION
function garageSaved(result, targetUrl, params) {
    if (result && result.ok) {
        console.log("Saved Garage.");
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}

//Saves a new garage after user inputs one
function saveGarage() {
    let values = {};
    values['garageName'] = document.getElementById("garageName").value;
    values['numSpots'] = document.getElementById("numSpots").value;
    values['numHandicapSpots'] = document.getElementById('numHandicapSpots').value;
    values['address'] = document.getElementById("address").value;
    values['phone'] = document.getElementById("phoneNumber").value;
    values['ownerDL'] = document.getElementById("ownerDL").value;
    sendJsonRequest(values,'/add-garage', garageSaved)
}

function loadGarage() {
    var phone = document.getElementById("phoneCheck").value;
    let params = {};
    params['phone'] = phone;
    var elem = document.getElementById("DisplayArea");
    elem.innerHTML = "<div class='loader'></div>";
    sendJsonRequest(params, '/load-garage', displayGarage);
}

//Change a DIV to show garage immediately after stored
function displayGarage(result, targetUrl, params) {
    /*Gameplan is to change display array to text of garage object returned*/
    var elem = document.getElementById("DisplayArea");
    elem.innerHTML = '';
    text = '<ul>';
    text += '<li>Garage ID: ' + result['gID'] + '</li>';
    text += '<li>Garage Name: ' + result['name'] + '</li>';
    text += '<li>Floor Count: ' + result['floorCount'] + '</li>';
    text += '<li>Spaces: ' + result['spaces'] + '</li>';
    text += '<li>Address: ' + result['address'] + '</li>';
    text += '<li>Phone Number: ' + result['phone'] + '</li>';
    text += '</ul>';
    elem.innerHTML = text;
}

function addUser(){
    var userInfo = {};
    userInfo['username'] = document.getElementById("username").value;
    userInfo['phone'] = document.getElementById("phone").value;
    userInfo['dl_no'] = document.getElementById("dl_no").value;
    sendJsonRequest(userInfo, '/add-user', userAddedCallback);
}

function userAddedCallback(jsonObject, targetUrl, parameterObject){
    console.log("User added");
    window.location = '/static/account.html' // Ideally, they would be auto logged in when redirected
}



function showRandomQuote(){
    var elem = document.getElementById('randomQuotes');

    //Enter the amount of quotes you are using.
    var numQuotes = "4";

    //In between the " "; enter in your message. Remember not to use double
    //quote (") in your message. You may use a single quote (').

    var quoteList = new Array(1000);
    quoteList[0] = "The solution to all your parking problems.";
    quoteList[1] = "The future of parking.";
    quoteList[2] = "Pay for parking by the hour.";
    quoteList[3] = "Create an account today!";

    var randNum = Math.floor(Math.random() * numQuotes);
    console.log(randNum);
    var randQuote = quoteList[randNum];
    console.log(randQuote);
    elem.innerHTML = "<p><b>" + randQuote + "</b></p>";
}

function getLoggedInUser(){
    console.log('enter getLoggedInUser()');
    var elem = document.getElementById('getLoggedInUser');
    elem.innerHTML = "<div class='loader'></div>";
    sendJsonRequest(null, '/get-user', getLoggedInUserCallback);
}

function getLoggedInUserCallback(returnedObject, targetUrl, unused){
    var elem = document.getElementById('getLoggedInUser');
    elem.innerHTML = '';
    var text = '';
    // text += "<marquee><p><h2>User Information</h2><br> User ID: " + returnedObject['uid'] + "<br>";
    text += "<p>User ID: " + returnedObject['uid'] + "<br>";
    text += "Username: " + returnedObject['username'] + "<br>";
    text += "Phone: " + returnedObject['phone'] + "<br>";
    text += "Driver's License Number: " + returnedObject['dl_no'] + "</p><br>";
    // text += "Driver's License Number: " + returnedObject['dl_no'] + "</p><br></marquee>";
    elem.innerHTML = text;
}

function openAccordion() {
    var item = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < item.length; i++) {
        item[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

/* ----------------------- Reserve Page Dropdowns ------------------------ */ 

// Loads the garages for the dropdown in the reserve page
function loadAllGarages() {
    console.log("Loading all garages for dropdown...")
    sendJsonRequest(null, '/load-all-garages', loadAllGaragesCallback);
}

function loadAllGaragesCallback(returnedObject, targetUrl, unused) {
    var dropdown = document.getElementById("garageSelect");
    text = '';
    text += "<option value='null'>--Select--</option>";
    Object.keys(returnedObject).forEach(function(key) {
       text += "<option value='" + returnedObject[key]['Name'] + "'>" + returnedObject[key]['Name'] + "<//option>";
    });
    dropdown.innerHTML = text;
}

function showSpots() {
    var time_in = getCheckinTime();
    var time_out = getCheckoutTime();
    var dateValue= document.getElementById('checkinDate').value;
    if(!Date.parse(dateValue)){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Please enter a valid date.</p>";
    }
    else if (time_out <= time_in){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Checkout time must be after checkin time.</p>";
    }
    else{
        document.getElementById('errorMsg').innerHTML = "";
        document.getElementById('spotsMessage').innerHTML = "<br><div class='loader'></div>"
        var garageName = document.getElementById("garageSelect").value;
        let params = {};
        params['garageName'] = garageName;
        params['checkinTime'] = getCheckinTime();
        params['checkoutTime'] = getCheckoutTime();
        params['handicap'] = document.getElementById('handicap').checked;

        sendJsonRequest(params, '/populate-spots', showSpotsCallback);
    }
}

function showSpotsCallback(returnedObject, targetUrl, nope){
    document.getElementById('spotsMessage').innerHTML = '';
    var dropdown = document.getElementById('spotSelect');
    text = '';
    text += "<p class='reserve-section-header'>The following spots are available at the time you selected. Please select a spot</p>";
    text += "<select id='spot_selected'>";
    console.log(returnedObject);
    for(var i=0; i<returnedObject.length; i++){
        text += "<option value='" + returnedObject[i]['space_id'] + "'>" + returnedObject[i]['num'] + "</option>";
    }
    text += "</select>"
    dropdown.innerHTML = text;
    var buttons = document.getElementById('Buttons');
    buttons.innerHTML = "<button id='reserveSpot' onclick='reserveSpot()'>Reserve Spot</button>"
}

function reserveSpot() {
    var time_in = getCheckinTime();
    var time_out = getCheckoutTime();
    if (time_out <= time_in){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Checkout time must be after checkin time.</p>";
    }
    document.getElementById('errorMsg').innerHTML = "<br><div class='loader'></div>";
    var garage_name = document.getElementById('garageSelect').value;
    var spot_selected = document.getElementById('spot_selected').value;
    params = {};
    params['time_in'] = time_in;
    params['time_out'] = time_out;
    params['garage_name'] = garage_name;
    params['spot_selected'] = spot_selected;
    sendJsonRequest(params, '/reserve-spot', reserveSpotCallback)
}

function reserveSpotCallback(returnedObject, url, naw) {
    if (returnedObject['error']){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Error!</p>";
    }
    else{
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Success! Redirecting to your account page...</p>";
        setTimeout( function() {
            document.location = '/static/account.html'
        }, 3000);
        
    }
}

function getCheckinTime(){
    var date = document.getElementById('checkinDate').value;
    var inHour = document.getElementById('checkinHour').value;
    var inMinute = document.getElementById('checkinMinutes').value;
    var inAMorPM = document.getElementById('checkinAMorPM').value;
    var inTime = convertToTime(date, inHour, inMinute, inAMorPM);
    return inTime;
}

function getCheckoutTime(){
    var date = document.getElementById('checkinDate').value
    var outHour = document.getElementById('checkoutHour').value;
    var outMinute = document.getElementById('checkoutMinutes').value;
    var outAMorPM = document.getElementById('checkoutAMorPM').value;
    var outTime = convertToTime(date, outHour, outMinute, outAMorPM);
    return outTime;
}

function convertToTime(date, hour, minute, AMorPM){
    return new Date(date + ' ' + hour + ':' + minute + ' ' + AMorPM);
}

/* ----------------------- End Reserve Page Dropdowns ------------------------ */ 

// Pre-fills the information of a user into the update account info form on the account page
function prefillAccountInfo() {
    console.log("enter prefillAccountInfo()");
    sendJsonRequest(null, '/get-user', accountInfoCallback);
}

function accountInfoCallback(returnedObject, targetUrl, unused) {
    var elem = document.getElementById('username');
    elem.value = returnedObject['username']
    var elem = document.getElementById('phone');
    elem.value = returnedObject['phone']
    var elem = document.getElementById('dl_no');
    elem.value = returnedObject['dl_no']
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;

    document.getElementById("date").value = today;
}

// logs user information to the console when they're logged in
function onSignIn(googleUser) {
    document.getElementById("pleaseWait").innerHTML = "<br><div class='loader'></div>"

    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    let params = {}
    params['email'] = profile.getEmail();
    params['id_token'] = id_token;
    sendJsonRequest(params, '/login', onSignInCallback);
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
}

function onSignInCallback(returnedObject, targetURL, origParams){
    if(returnedObject['data']['user_in_db'] == "true"){
        window.location = '/static/index.html';
    }
    else{
        window.location = '/static/create_account.html';
    }
    console.log("enter onSignInCallback");
}

// Gets if the user is logged in
function loadIndex() {
    sendGetRequest('/userLoggedIn', loadIndexCallback);
}

// Shows menu items and hides login button if user is logged in 
function loadIndexCallback(params, targetUrl){
    var user = params['user_id'];
    elem = document.getElementById("mainBody");
    text = "";
    if(user != null){
        text = ""
        text += "<li><a href='reserve.html'>Reserve</a></li><li><a href='create_garage.html'>Create Garage</a></li><li><a href='account.html'>Account</a></li><li><a href='report.html'>Report</a></li>";
        document.getElementById('BannerPlaceholder').innerHTML = text;
        text = "<li><a href=# onclick='signOut()''>Log Out</a>";
        document.getElementById('LogoutPlaceholder').innerHTML = text;
        text = "<center>Welcome back!</center>";
        document.getElementById('indexBody').innerHTML = text;
    }
}


// Used when static pages are loaded (help and about)
// Shows all the menu buttons if the user is signed in
function loadStatic() {
    sendGetRequest('/userLoggedIn', loadStaticCallback);
    
}

//Show menu items and logout button if user is signed in
function loadStaticCallback(params, targetUrl) {
    var user = params['user_id'];
    if(user != null) {
        text = ""
        text += "<li><a href='reserve.html'>Reserve</a></li><li><a href='create_garage.html'>Create Garage</a></li><li><a href='account.html'>Account</a></li><li><a href='report.html'>Report</a></li>";
        document.getElementById('BannerPlaceholder').innerHTML = text;
        text = "<li><a href=# onclick='signOut()''>Log Out</a>";
        document.getElementById('LogoutPlaceholder').innerHTML = text;
    }
}


// Sign out of google sign in
function signOut() {
    gapi.load('auth2', function(){
        gapi.auth2.init().then(function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                document.location = '/dologout';
            });
        });
    });
}

//--ACCOUNTS PAGE LOAD RESERVATIONS

function loadAllReservations() {
    sendJsonRequest(null, '/load-reservations', loadAllReservationsCallback);
}

function loadAllResrvations(result, targetUrl, oogabooga) {
    console.log(result)
}