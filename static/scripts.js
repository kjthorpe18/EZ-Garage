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
        document.location= 'http://localhost:8080/static/account_garages.html';
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}

// Order for saving Garage: setupForGetCoords -> getCoords -> saveGarage

// Function that is called on sumbit from the createGarage page
function setupForGetCoords() {
    var address = document.getElementById("addAddress").value;
    postParams = {
        'address' : address
    }
    sendJsonRequest(postParams,'/get-coords', saveGarage)
}

//Saves a new garage after user inputs one
function saveGarage(returnedJSON) {
    let values = {};
    values['garageName'] = document.getElementById("garageName").value;
    values['numSpots'] = document.getElementById("numSpots").value;
    values['numHandicapSpots'] = document.getElementById('numHandicapSpots').value;
    values['address'] = document.getElementById("address").value;
    values['phone'] = document.getElementById("phoneNumber").value;
    values['ownerDL'] = document.getElementById("ownerDL").value;
    // Parse json to get the lat and longitude
    jsonData = JSON.parse(returnedJSON)
    try {
        //console.log(jsonData)
        //console.log('geometry-> ', jsonData[0].geometry.location)
        var lat = jsonData[0].geometry.location.lat;
        var lng = jsonData[0].geometry.location.lng;
        values['latitude'] = lat;
        values['longitude'] = lng;
    } catch (err) {
        // Geocode API didn't find a matching address so add fake lat and long
        values['latitude'] = '-1.00';
        values['longitude'] = '-1.00';
    }
    sendJsonRequest(values,'/add-garage', garageSaved)
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
    text += "<option value=null>--Select--</option>";
    Object.keys(returnedObject).forEach(function(key) {
       text += "<option value='" + returnedObject[key]['Name'] + "'>" + returnedObject[key]['Name'] + "<//option>";
    });
    dropdown.innerHTML = text;
}

function loadUserCars() {
    sendJsonRequest(null, '/load-cars-user', loadUserCarsCallback);
}

function loadUserCarsCallback(returnedObject, targetUrl) {
    var dropdown = document.getElementById('vehicleSelect');
    console.log(returnedObject);
    text = '';
    text += "<option value=null>--Select--</option>";
    for (var i = 0; i<returnedObject.length; i++){
        text += "<option value='" + returnedObject[i]['plate_num'] + "'>" + returnedObject[i]['make'] + ' ' + returnedObject[i]['model'] + ' - ' + returnedObject[i]['plate_num'] + '</option>';
    }
    dropdown.innerHTML = text;
}

function showSpots() {
    var time_in = getCheckinTime();
    var time_out = getCheckoutTime();
    var dateValue= document.getElementById('checkinDate').value;
    if(!Date.parse(dateValue)){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Please enter a valid date.</p>";
        return
    }
    if (time_out <= time_in){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Checkout time must be after checkin time.</p>";
        return;
    }
    if ((document.getElementById("garageSelect").value) == 'null'){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Please select a garage.</p>";
        return;
    }
    if ((document.getElementById('vehicleSelect').value) == 'null'){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Please select a vehicle.</p>";
        return;
    }

    document.getElementById('errorMsg').innerHTML = "";
    document.getElementById('spotsMessage').innerHTML = "<br><div class='loader'></div>"
    var garageName = document.getElementById("garageSelect").value;
    let params = {};
    params['garageName'] = garageName;
    params['checkinTime'] = getCheckinTime();
    params['checkoutTime'] = getCheckoutTime();
    params['handicap'] = document.getElementById('handicap').checked;
    console.log(params);

    sendJsonRequest(params, '/populate-spots', showSpotsCallback);
}

function showSpotsCallback(returnedObject, targetUrl, nope){
    document.getElementById('spotsMessage').innerHTML = '';
    if(returnedObject.length == 0){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>There were no spots available at that garage for the times you selected. Please try again.</p>";
        return;
    }
    var dropdown = document.getElementById('spotSelect');
    text = '';
    text += "<p class='reserve-section-header'>The following spots are available at the time you selected. Please select a spot:</p>";
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
    var vehicle_selected = document.getElementById('vehicleSelect').value;
    params = {};
    params['time_in'] = time_in;
    params['time_out'] = time_out;
    params['garage_name'] = garage_name;
    params['spot_selected'] = spot_selected;
    params['vehicle_selected'] = vehicle_selected;
    console.log(params);
    sendJsonRequest(params, '/reserve-spot', reserveSpotCallback)
}

function reserveSpotCallback(returnedObject, url, naw) {
    if (returnedObject['error']){
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Error!</p>";
    }
    else{
        document.getElementById('errorMsg').innerHTML = "<p class='reserve-section-header'>Success! Redirecting to your account page...</p>";
        setTimeout( function() {
            document.location = '/static/account_reservations.html'
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
        text += "<li><a href='reserve.html'>Reserve</a></li><li><a href='account.html'>Account</a></li><li><a href='report.html'>Report</a></li>";
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
        text += "<li><a href='reserve.html'>Reserve</a></li><li><a href='account.html'>Account</a></li><li><a href='report.html'>Report</a></li>";
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


//----Start Reports--------

function saveReport(name) {
    //need to see if user is logged in to get current user, if not alert they must sign in, using default user now


        let values = {};
        values['userBy'] = name;
        values['plate'] = document.getElementById("platenum").value;
        values['space'] = document.getElementById("spaceID").value;
        values['dateOccured'] = document.getElementById("date").value;
        values['description'] = document.getElementById("description").value;

        values['dateSubmitted'] = Date.now().toString();
        values['garage'] = document.getElementById("garage").value;
        console.log('Created report... for ' + document.getElementById("platenum").value);
        console.log('Values: ' + values['userBy'] + ' ' + values['plate'] + ' ' + values['dateOccured'] + ' ' + values['description'] + ' ' + values['dateSubmitted'] + ' ' + values['garage']);
        sendJsonRequest(values,'/add-report', reportSaved);


    }

//Load all Reports for a Garage
function loadAllReports() {
    garage = 'Cool Garage'
    let params = {};
    params['garage'] = garage;

    sendJsonRequest(params,'/load-all-reports', loadAllCallback);
}

function loadAllCallback(result, targetUrl, params) {
    console.log('Load All has returned')
    console.log(result)
}

function getUserForReport(){
        console.log('entering getUserforReport');
        sendJsonRequest(null, '/get-user', reportUserCallback);
}




function reportUserCallback(returnedObject, targetUrl, unused){
    let name = returnedObject['username'];
    saveReport(name);

}

function reportSaved(result, targetUrl, params) {
     if (result && result.ok) {
         console.log("Saved Report.");
     } else {
         console.log("Received error: " + result.error);
         showError(result.error);
       }
    }

//-- END REPORTS

// -----------START CAR -----------------

function saveCar() {
    let values = {};
    values['make'] = document.getElementById("Make").value;
    values['model'] = document.getElementById("Model").value;
    values['plate'] = document.getElementById("Plate").value;
    console.log(values);
    sendJsonRequest(values, '/add-car', saveCarCallback);
}

function saveCarCallback(result, targetUrl, params) {
    if (result && result.ok) {
        console.log("Saved Car.");
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}

function loadCarTable() {
    console.log("Loading cars...");
    sendJsonRequest(null, '/load-cars-user', loadCarTableCallback);
}

function loadCarTableCallback(result, targetURL, origParams) {
    console.log(result);
    var elem = document.getElementById("car-section");
    var constantTag = '<td>';
    var closeTag = '</td>';
    elem.innerHTML = '';

    text = '<h2>Your Cars:</h2> <table> <tr> <th style="width: 150px;">Make</th> <th style="width: 150px;">Model</th> <th style="width: 150px;">License Plate</th></tr>';

    for (x in result) {
        text += '<tr>'
        text += constantTag + result[x].make + closeTag;
        text += constantTag +result[x].model + closeTag;
        text += constantTag + result[x].plate_num + closeTag;
        text += '</tr>'
    }
    text += '</table>'
    elem.innerHTML = text;
}
//----- END CAR

//-- START RESERVE TABLE

function loadReserveTable() {
    sendJsonRequest(null, '/load-reservations-user', loadReserveCallback)
}

function loadReserveCallback(returnedObject, url) {
    var elem = document.getElementById('reserve-section')
    console.log(returnedObject);
    text = '<h2>Your Reservations:</h2> <table> <tr> <th style="width: 100px;">Parking Spot</th> <th style="width: 150px;">Time-In</th> <th style="width: 150px;">Time-Out</th> <th style="width: 80px;">Vehicle License Plate No.</th></tr>';
    var oTag = "<td>";
    var cTag = "</td>";

    for(var i=0; i<returnedObject.length; i++){
        text += "<tr>" + oTag +  returnedObject[i]['space_id'] + cTag + oTag + toSimpleDate(returnedObject[i]['time_in']) + cTag + oTag + toSimpleDate(returnedObject[i]['time_out']) + cTag + oTag + returnedObject[i]['vehicle_id'] + cTag + "</tr>";
    }

    elem.innerHTML = text;

}

function toSimpleDate(date){
    date = new Date(date);
    let formatted_date = date.getFullYear() + "-" + appendLeadingZeroes((date.getMonth() + 1)) + "-" + appendLeadingZeroes(date.getDate()) + " " + appendLeadingZeroes(date.getHours()) + ":" + appendLeadingZeroes(date.getMinutes()) + ":" + appendLeadingZeroes(date.getSeconds());
    return formatted_date;
}

function appendLeadingZeroes(n){
  if(n <= 9){
    return "0" + n;
  }
  return n;
}



//--START Account Pages

function getTableGarages() {
    console.log('Entering getTableGarage');
    sendJsonRequest(null, '/get-user', tableGarageCallback);
}

function tableGarageCallback(returnedObject, targetUrl, unused){
    console.log('Entering tableCallback');
    console.log('result:');
    console.log(returnedObject);
    let drNum = returnedObject['dl_no'];
    loadAllGaragesUser(drNum);
}

function loadAllGaragesUser(drNum) {
    console.log('Entering loadAllGaragesUser');
    let params = {};
    params['dl_number'] = drNum;
    sendJsonRequest(params, '/load-all-garages-user', loadAllGaragesUserCallback);
}

function loadAllGaragesUserCallback(result, targetURL, origParams) {
    console.log(result);
    var elem = document.getElementById("garage-section");
    var constantTag = '<td>';
    var closeTag = '</td>';
    elem.innerHTML = '';

    text = '<h2>Your Garages:</h2> <table> <tr> <th style="width: 150px;">Name</th> <th style="width: 150px;">Address</th> <th style="width: 200px;">Handicap Spots</th>  <th style="width: 300px;">Non-Handicap Spots</th>  <th style="width: 80px;">Phone</th> </tr>';
    for (var x=0; x<result.length; x++) {
        text += '<tr>'
        text += constantTag + result[x]['Name'] + closeTag;
        text += constantTag + result[x]['Address'] + closeTag;
        text += constantTag + result[x]['numHandicapSpots'] + closeTag;
        text += constantTag + result[x]['numSpots'] + closeTag;
        text += constantTag + result[x]['Phone'] + closeTag;
        text += '</tr>'
    }
    text += '</table>'
    elem.innerHTML = text;
}

function getTableAccount() {
    console.log('Entering getTableAccount');
    sendJsonRequest(null, '/get-user', tableAcountCallback);
}

function tableAcountCallback(result, targetURL, origParams) {
    console.log(result);
    var elem = document.getElementById("account-section");
    var constantTag = '<td>';
    var closeTag = '</td>';
    elem.innerHTML = '';

    text = '<h2>Your Account:</h2> <table> <tr> <th style="width: 150px;">Username</th> <th style="width: 150px;">Phone Number</th> <th style="width: 150px;">Driver\'s License</th></tr>';


    text += '<tr>'
    text += constantTag + result['username'] + closeTag;
    text += constantTag +result['phone'] + closeTag;
    text += constantTag + result['dl_no'] + closeTag;
    text += '</tr>'

    text += '</table>'
    elem.innerHTML = text;
}




//---ACCOUNT PAGE ADD DOM

function addVehicle() {
  // Remove the button from the page
  document.getElementById("create-vehicle-button").innerHTML = '';

  // Add Create Vehicle fields to the page
  var elem = document.getElementById("create-vehicle");
  text = '<div style="width: 50%; margin: auto;">'
  text += '<h2>Add Your Vehicle:</h2>'
  text += '<form onsubmit="return false;">'
  text += '<label for="vehicle_make">Make:   </label>'
  text += '<input type="text" id="Make" name="vehicle_make">'
  text += '<br><br>'
  text += '<label for="vehicle_model">Model:   </label>'
  text += '<input type="text" id="Model" name="vehicle_model">'
  text += '<br><br>'
  text += '<label for="vehicle_license_plate_number">License Plate Number:   </label>'
  text += '<input type="text" id="Plate" name="vehicle_license_plate_number">'
  text += '<br><br>'
  text += '<button type="button" onclick="saveCar()">Submit</button><button type="button" onclick="cancelAddVehicle()">Cancel</button>'
  text += '</form>'
  text += '</div>'
  elem.innerHTML = text;
}

function cancelAddVehicle() {
  // Remove Create Vehicle fields from the page
  document.getElementById("create-vehicle").innerHTML = '';

  // Add the button to the page
  var elem = document.getElementById("create-vehicle-button");
  text = '<img src="images/add.png" alt="Add Vehicle" width = "50px" height = "50px" style="vertical-align: middle">'
  text += '<span style="color: black; font-weight:bolder">Add Vehicle</span>'
  elem.innerHTML = text;
}

function addGarage() {
    // Remove the button from the page
    document.getElementById("create-garage-button").innerHTML = '';

    // Add Create Garage fields to the page
    var elem = document.getElementById("create-garage");
    text = '<div style="width: 50%; margin: auto;">';
    text += '<h2>Add Your Garage:</h2>';
    text += '<form onsubmit="return false;">';
    text += '<label>Enter Garage Name:   </label>';
    text += '<input type="text" id= "garageName"></input>';
    text += '<br><br>';
    text += '<label>Add Space Count:   </label>';
    text += '<input type="number" id = "numSpots"></input>';
    text += '<br><br>';
    text += '<label>Add Handicap Space Count:   </label>';
    text += '<input type="number" id = "numHandicapSpots"></input>';
    text += '<br><br>';
    text += '<label>Enter Address:   </label>';
    text += '<input type="text" id="address"></input>';
    text += '<br><br>';
    text += '<label>Enter Owner Drivers License Number:   </label>';
    text += '<input type="number" id="ownerDL"></input>';
    text += '<br><br>';
    text += '<label>Enter Phone Number:   </label>';
    text += '<input type="number" id="phoneNumber"></input>';
    text += '<br><br>';
    text += '<button onclick="saveGarage()">Submit</button><button onclick="cancelAddGarage()">Cancel</button>';
    text += '<br><br>';
    text += '</form>';
    text += '</div>';
    elem.innerHTML = text;
}

function cancelAddGarage() {
  // Remove Create Garage fields from the page
  document.getElementById("create-garage").innerHTML = '';

  // Add the button to the page
  var elem = document.getElementById("create-garage-button");
  text = '<img src="images/add.png" width = "50px" height = "50px" style="vertical-align: middle">'
  text += '<span style="color: black; font-weight:bolder">Add Garage</span>'
  elem.innerHTML = text;
}
// Function to make API call to maps API
function setupMap() {
    // Connect to backend to make the API call.
    console.log('In setupMap');
    sendJsonRequest("",'/get-map', mapApiCall);
}

// Makes the API Call since the API key was grabbed from the backend
async function mapApiCall(jsonObject) {
    console.log('Made API Call: ', jsonObject);
    // Parse the URI from the returned data
    uri = jsonObject['uri'];
    // Make the get request
    sendJsonRequest("", uri, initMap);
}
