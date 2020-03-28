/*
    This file holds the JS functions used to send and receive data to the server.

    The basic flow of information for sending and receiving data to/from the server is:
        In your function in the scripts.js file:
            1. prepare the data that you want to send to the server into a JS dictionary:
                - var userInfo = {}
                - userInfo['name'] = 'Matt' etc...
            2. prepare a callback function to perform functions based on the data returned by the server
            3. Call sendJsonRequest with the following parameters: 
                - 1-the parameter object prepared in step 1
                - 2-the target URL that the backend server will respond to when accessed
                - 3-the callback function created in step 2

    The sendJsonRequest function acts as a sort of template to use when sending and receiving data to the server
        - this way we don't have to worry about the details every time we need to post parameters

*/

// Used to create an XMLHttp object
// sendJsonRequest() calls this to create an XMLHttp object which will be used to send and receive data to the server
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

function sendJsonRequest(parameterObject, targetUrl, callbackFunction) {
    console.log('server_access: Enter sendJsonRequest')
    var xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            console.log(xmlHttp.responseText);
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, parameterObject);
        }
    }
    console.log('\t' + targetUrl);
    console.log('\t' + parameterObject);
    console.log('\t' + objectToParameters(parameterObject))
    postParameters(xmlHttp, targetUrl, objectToParameters(parameterObject));
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