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

    var randNum = Math.round(Math.random() * numQuotes);
    var randQuote = quoteList[randNum];
    elem.innerHTML = "<p><b>" + randQuote + "</b></p>";
}

function addUser(){
    var auth2 = gapi.auth2.getAuthInstance();
    var profile = auth2.currentUser.get();
    var userInfo = {};
    userInfo['user_token'] = profile.getAuthResponse().id_token;
    console.log('user_token: ' + userInfo['user_token']);
    userInfo['username'] = document.getElementById("username").value;
    userInfo['pwd'] = document.getElementById("pwd").value;
    var confirmPass = document.getElementById("pwd2").value;
    if(userInfo['pwd'] != confirmPass){
        var errorElem = document.getElementById("error");
        errorElem.innerHTML = "Passwords do not match. Please try again."
        console.log("Passwords do not match. Please try again.");
        return;
    }
    userInfo['dl_no'] = document.getElementById("dl_no").value;
    sendJsonRequest(userInfo, '/add-user', userAddedCallback);
}

function userAddedCallback(jsonObject, targetUrl, parameterObject){
    console.log("User added");
    window.location = '/static/account.html' // Ideally, they would be auto logged in when redirected
}

function getLoggedInUser(){
    console.log('enter getLoggedInUser()');
    sendJsonRequest(null, '/get-user', getLoggedInUserCallback);
}

function getLoggedInUserCallback(returnedObject, targetUrl, unused){
    var elem = document.getElementById('getLoggedInUser');
    var text = '';
    text += "<p><h2>User Information</h2><br> User ID: " + returnedObject['uid'] + "<br>";
    text += "Username: " + returnedObject['username'] + "<br>";
    text += "Password(This isn't actually necessary): " + returnedObject['pwd'] + "<br>";
    text += "Driver's License Number: " + returnedObject['dl_no'] + "</p><br>";
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
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}


// Sign out of google sign in
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}