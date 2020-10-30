const zerorpc = require("zerorpc");
let client = new zerorpc.Client();

client.connect("tcp://127.0.0.1:4242"); // connect to backend server

client.invoke("echo", "server ready", (error, res) => {
  if (error || res !== "server ready") {
    console.error(error);
  } else {
    console.log("server is ready"); // printed when python server is ready
  }
});

// variables to reference document elements
let input1 = document.querySelector("#input1");
let input2 = document.querySelector("#input2");
let result = document.querySelector("#result");
let calculateSum = document.querySelector("#calculateSum");

// check if an input is a valid number
let validateInput = (input) => {
  return input.match(/^[+-]?((0\.\d+)|(\d+(\.\d+)?))$/);
};

// disable button if any of the inputs are invalid
// button should be disable for invalid input
let buttonDisableCheck = () => {
  validity = document.getElementsByClassName("is-invalid");
  if (validity.length > 0) {
    document.querySelector("#calculateSum").disabled = true;
  } else {
    document.querySelector("#calculateSum").disabled = false;
  }
};

// check validity of input as when the user types
// button should be disable for invalid input
input1.addEventListener("input", (evt) => {
  if (!validateInput(input1.value)) {
    console.log("invalid");
    input1.classList.add("is-invalid");
  } else {
    input1.classList.remove("is-invalid");
  }
  buttonDisableCheck();
});

// check validity of input as when the user types
input2.addEventListener("input", (evt) => {
  if (!validateInput(input2.value)) {
    console.log("invalid");
    input2.classList.add("is-invalid");
  } else {
    input2.classList.remove("is-invalid");
  }
  buttonDisableCheck();
});

// take both numbers and package into a JSON object. 
// Using JSON allows for expandability is needed. 
calculateSum.addEventListener("click", () => {
  json_string = `{"input1": ${input1.value}, "input2": ${input2.value}}`;
  //console.log(json_string);
  client.invoke("sum", json_string, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      result.value = res;
    }
  });
});
