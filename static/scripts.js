

//--------Ripped from week06 project 7


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
            console.log(xmlHttp.responseText);
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, parameterObject);
        }
    }
    console.log(targetUrl);
    console.log(parameterObject);
    postParameters(xmlHttp, targetUrl, objectToParameters(parameterObject));
}

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

// this is called in response to saving list item data.
//edited into garage CALLBACKFUNCTION
function garageSaved(result, targetUrl, params) {
    if (result && result.ok) {
        console.log("Saved Garage.");
    } else {
        console.log("Received error: " + result.error);
        showError(result.error);
    }
}


//--------END of COPY PASTE

//Saves a new garage after user inputs
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


//Change a DIV to show garage immediately after stored
function displayGarage(result, targetUrl) {
    /*Gameplan is to change display array to text of garage object returned*/
    garageToSearch = document.getElementById("displayGarage");

    let text = '<ul>';
    for (var key in result) {
        text += '<li id="attribute_'+ key + '">';
        text += result[key]
        text += '</li>';
        
    text += '</ul>';

    document.getElementById("DisplayArea").innerHTML = text;

}

}

function loadGarage() {
    phone = document.getElementById("phoneCheck").value;
    
    getData('/load-garage/' +phone, displayGarage);
}

//test function to GET garage entity after storing

/*----Datastore process and Ajax process:
    --python class of object with toDict
    --classData.py which has the datastore functions read, write edit
    
    --First, take user input
    --send JSONrequest with it, (json obj, flask route, callbackFUcntion)
    --Main py calls classDATA.py
    --Check to see if it's already there (skipping in test)
    --if not there -> ADD to datastore, ELSE edit the current datastore
    --what the hell does json_result['ok'] do
    
    --Second, Show the user input from db
    --define callbackfunction with (jsonREsult, targetURL)
    -- get ID of some div you want to change
    --use a text var and shove it in between div with getElementByID("stuff").innerHTML = text
    --call getData (route, callbackfunctionDisplays)
    --remember callbackfunctionDiplays first argument is the RESULT of call
    
    --IN MAIN.PY we call get_item that returns a list() with the stuff we want
    --define json_list[]
    --turn the thing retured by get_item into dictionary
    --append to json_list
    --json.dumps(json_lits)
--return flask.Response(responseJson, mimetype = 'application/json') */ 