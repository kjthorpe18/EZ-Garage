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
    values['name'] = document.getElementById("addName").value;
    values['floorCount'] = document.getElementById("addFloorCount").value;
    values['spaces'] = document.getElementById("addSpaces").value;
    values['address'] = document.getElementById("addAddress").value;
    values['phone'] = document.getElementById("addPhone").value;
    values['ownerDL'] = document.getElementById("addOwnerDL").value;
    console.log(document.getElementById("addName").value)
    console.log(document.getElementById("addFloorCount").value)
    console.log(document.getElementById("addAddress").value)
    console.log(document.getElementById("addPhone").value)
    console.log(document.getElementById("addOwnerDL").value)

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
}

function onSignInCallback(returnedObject, targetURL, origParams){
    if(returnedObject['data']['user_in_db'] == "true"){
        window.location = '/static/account.html';
    }
    else{
        window.location = '/static/create_account.html';
    }
    console.log("enter onSignInCallback");
}


// Sign out of google sign in
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
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
        console.log('enter getUserforReport');
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
