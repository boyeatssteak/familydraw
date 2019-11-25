function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
let testData = "Hello, look I'm a message.";

function addName() {
  let name1 = document.getElementById("name1");
  let name2 = document.getElementById("name2");
  app.names.push([name1.value, name2.value]);
  app.names.push([name2.value, name1.value]);
  name1.value = "";
  name2.value = "";
}

const app = new Vue({
  el: '#app',
  data: {
    message: "Hello x",
    names: []
  }
})

function updated() {

}
function area() {
  console.log("area'd");
}