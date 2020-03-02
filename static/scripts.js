function showRandomQuote(){
    var elem = document.getElementById('randomQuotes');

    //Enter the amount of quotes you are using.
    var quotnum = "3";

    //In between the " "; enter in your message. Remember not to use double
    //quote (") in your message. You may use a single quote (').

    var sds = new Array(1000);
    sds[0]="The solution to all your parking problems.";
    sds[1]="The future of parking.";
    sds[2]="Pay for parking by the hour.";
    sds[3]="Create an account today!";

    var arandomn=Math.random() * quotnum;
    arandomn=Math.round(arandomn);
    var daquote =sds[arandomn];

    elem.innerHTML = "<p><b>" + daquote + "<b></p>";

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