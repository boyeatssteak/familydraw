var gk = ["Dad", "Mom"];
var bn = ["bo", "nat"];
var jb = ["John", "Bri"];
var zb = ["Zak", "Bekah"];
var mh = ["Mike", "Hannah"];

allParticipantsArray = [gk, bn, jb, zb, mh];
allParticipants = [].concat.apply([], allParticipantsArray);

// console.log(allParticipants);

var drawers = allParticipants;
var drawees = allParticipants;

function shuffleFamily(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var swapPosition = Math.floor( Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[swapPosition];
        array[swapPosition] = temp;
    }
}

shuffleFamily(allParticipants);

// console.log(allParticipants);

function testPair (one, two) {
    var result = true;
    for (var i = 0; i < allParticipantsArray.length; i++) {
        if (allParticipantsArray[i].indexOf(one) >= 0 && allParticipantsArray[i].indexOf(two) >= 0) {
            result = false;
        }
    }
    return result;
}

function testDraws(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var nameOne = array[i];
        var nameTwo = array[i+1];
        if (i === array.length - 1) {
            nameTwo = array[0];
        }
        result[i] = testPair(nameOne,nameTwo);
        // console.log("Testing " + nameOne + " with " + nameTwo + ": " + result[i]);
    }
    return !(result.indexOf(false) >= 0);
}

var successfulDraw = false;
var iterations = 0;
while (!successfulDraw) {
    iterations++;
    shuffleFamily(allParticipants);
    successfulDraw = testDraws(allParticipants);
}
console.log(iterations, allParticipants);

var txtFile = "~/test.txt";
var file = new File(txtFile);
var string = "testing 123";

file.open("w");
file.writeIn("Another thing to test");
file.write(str);
file.close();
