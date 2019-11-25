function parseNames() {
  let input = document.getElementById("names").value;
  let lines = input.split("\n");
  let inputAsArray = [];
  for(let line of lines) {
    line = trimSpaces(line);
    inputAsArray.push(line.split(" "));
  }
  return inputAsArray;
}

function trimSpaces(string) {
  let trimmed = string.trim();
  do {
    length = trimmed.length;
    trimmed = trimmed.replace(/  /g, " ");
    newLength = trimmed.length;
  } while (newLength < length)
  return trimmed;
}

function shuffleGroup(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var swapPosition = Math.floor( Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[swapPosition];
    array[swapPosition] = temp;
  }
}

function testPair (one, two) {
  let allParticipantsArray = parseNames();
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
  }
  return !(result.indexOf(false) >= 0);
}

function fac(num) {
  let factorial = 1;
  let step = 2;
  while(step <= num) {
    factorial *= step;
    step++;
  }
  return factorial;
}

function doit() {
  let allParticipantsArray = parseNames();
  allParticipantsOrdered = [].concat.apply([], allParticipantsArray);
  allParticipants = allParticipantsOrdered.slice(0);
  let successfulDraw = false;
  let iterations = 0;
  let limit = 100000;
  if(fac(allParticipants.length) < 100000) {
    limit = fac(allParticipants.length);
  }
  while (!successfulDraw && iterations < limit) {
      iterations++;
      shuffleGroup(allParticipants);
      successfulDraw = testDraws(allParticipants);
  }
  if(iterations >= limit) {
    checkData();
  } else {
    for(let i = 0; i < allParticipantsOrdered.length; i++) {
      let drawn = getDrawnName(allParticipants, allParticipants.indexOf(allParticipantsOrdered[i]));
      let arr = allParticipants.slice(0);   
      shuffleGroup(arr);
      allParticipantsOrdered.splice(i, 1, [allParticipantsOrdered[i], arr, drawn]);
    }
    sessionStorage.setItem('data', JSON.stringify(allParticipantsOrdered));
    sessionStorage.setItem('iterations', iterations);
    let a = document.createElement('a');
    a.href = "step2.html";
    a.click();
  }
}

function getDrawnName(array, index) {
  if(index + 1 >= array.length) {
    return array[0];
  } else {
    return array[index + 1];
  }
}

function generateFileContents(data, iterations) {
  let output = "It took me " + iterations + " shuffles before I found a combo that worked, but here are the results:";
  for(let i = 0; i < data.length; i++) {
    let drawData = data[i];
    output += "\n" + drawData[0] + " drew " + drawData[2];
  }
  return output;
}

let key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateList(array) {
  let output = array[0].toUpperCase();
  for(let i = 0; i < array[1].length; i++) {
    output += "\n" + key[i] + ": " + array[1][i];
  }
  return output;
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function showLists() {
  let dataElement = document.getElementById("showListsContainer");
  if (dataElement.innerHTML.length > 0) {
    dataElement.innerHTML = "";
  } else {
    let data = JSON.parse(sessionStorage.getItem('data'));
    for(let i = 0; i < data.length; i++) {
      let el = document.createElement('pre');
      el.innerHTML = generateList(data[i]);
      dataElement.appendChild(el)
    }
  }
}
function emailLinks() {
  let dataElement = document.getElementById("emailLinksContainer");
  if (dataElement.innerHTML.length > 0) {
    dataElement.innerHTML = "";
  } else {
    let data = JSON.parse(sessionStorage.getItem('data'));
    let list = document.createElement('ul');
    for(let i = 0; i < data.length; i++) {
      let li = document.createElement('li');
      let link = document.createElement('a');
      let name = (data[i][0]).toUpperCase();
      let subject = "Family Draw List for " + name;
      let body = "This is the list of people who are in the family draw with you. Your list is different than everyone else's, and you'll receive the letter indicating who your draw is shortly.\n\n";
      body += generateList(data[i]);
      link.setAttribute("href", "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
      link.setAttribute("target", "_blank");
      link.innerHTML = "Email to " + name;
      li.appendChild(link);
      list.appendChild(li);
    }
    dataElement.appendChild(list);
  }
}
function spoilers() {
  let dataElement = document.getElementById("spoilersContainer");
  if (dataElement.innerHTML.length > 0) {
    dataElement.innerHTML = "";
  } else {
    let data = JSON.parse(sessionStorage.getItem('data'));
    let list = document.createElement('ul');
    for(let i = 0; i < data.length; i++) {
      let name = data[i];
      let li = document.createElement('li');
      li.innerHTML = "<strong>" + name[0] + "</strong> drew <strong>" + name[2] + "</strong>";
      list.appendChild(li);
    }
    dataElement.appendChild(list);
  }
}
function callDownloader() {
  let data = JSON.parse(sessionStorage.getItem('data'));
  let iterations = sessionStorage.getItem("iterations");
  let output = generateFileContents(data, iterations);
  let date = Date.now();
  let filename = "draws-" + formatDate(date) + ".txt";
  download(output, filename, 'text/plain');
}
function formatDate(date) {
  let d = new Date(date),
    year = d.getFullYear(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    hours = '' + (d.getHours() + 1),
    minutes = '' + d.getMinutes();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  return year + month + day + "-" + hours + minutes;
}

function showDrawLetters() {
  let dataElement = document.getElementById("showDrawLettersContainer");
  if (dataElement.innerHTML.length > 0) {
    dataElement.innerHTML = "";
  } else {
    let data = JSON.parse(sessionStorage.getItem('data'));
    let message1 = "Merry Christmas "
    let message2 = "! 🎁🎄♥️\nYou drew letter ";
    for(let i = 0; i < data.length; i++) {
      let drawData = data[i];
      let drawIndex = drawData[1].indexOf(drawData[2]);
      let el = document.createElement('pre');
      let message = message1 + drawData[0] + message2 + key[drawIndex];
      el.innerHTML = message;
      dataElement.appendChild(el)
    }
  }
}

function checkData() {
  let data = JSON.parse(sessionStorage.getItem('data'));
  if (data === null || data.length < 2) {
    let a = document.createElement('a');
    a.href = "error.html";
    a.click();
  }
}