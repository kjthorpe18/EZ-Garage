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