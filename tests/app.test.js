const Application = require("spectron").Application;
const electronPath = require("electron");
const path = require("path");

let app = new Application({
  path: electronPath,
  args: [path.join(__dirname, "..", "main.js")],
  startTimeout: 10000,
});

if (process.platform === "win32") {
  //electronPath += '.cmd';
}

jest.setTimeout(10000); // Added a longer timeout to allow the app to start

// start app for testing
beforeAll(() => {
  return app.start();
  console.log("app started");
}, 25000);

// close app after testing is complete
afterAll(() => {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

/*
    Check if app opens with the right number of windows.
*/
test("App Init", async () => {
  let isVisible = await app.browserWindow.isVisible();
  expect(isVisible).toBe(true);
});

test("Displays App window", async () => {
  let count = await app.client.getWindowCount();
  expect(count).toEqual(1);
});

// Test app title
test("Displays Title", async () => {
  const title = await app.client.waitUntilWindowLoaded().getTitle();
  expect(title).toEqual("Technical Exercise");
});

/*
    check for the input fields and button to be rendered. 
*/
test("Has an input for the first number", async () => {
  const labelText = await app.client.getText('label[for="input1"]');
  expect(labelText).toEqual("Num 1:");

  const inputbox = await app.client.$("#input1");
  expect(inputbox.value).not.toEqual(null);
});

test("Has an input for the second number", async () => {
  const labelText = await app.client.getText('label[for="input2"]');
  expect(labelText).toEqual("Num 2:");

  const inputbox = await app.client.$("#input2");
  expect(inputbox.value).not.toEqual(null);
});

test("Button rendered", async () => {
  const inputbox = await app.client.$("#calculateSum");
  expect(inputbox.value).not.toEqual(null);
});

// Test valid inputs for correctness. Using arrays for cleanliness
test("Valid input", async () => {
  var inputs = [
    [1, 4, "5"],
    [0, 0, "0"],
    [-0, 7, "7"],
    [1, -4, "-3"],
    [-2, 6, "4"],
    [-4, -2, "-6"],
    [-2, 7, "5"],
    [1.5, 3, "4.5"],
    [-2, 5.67, "3.67"],
    [32.46194, -159.259, "-126.79706"]
  ];

  // run through all test cases
  for (i = 0; i < inputs.length; i++) {
    let test_input = inputs[i];

    await app.client.element('//input[@id="input1"]').setValue(test_input[0]);
    await app.client.element('//input[@id="input2"]').setValue(test_input[1]);

    let result = await app.client.element("#calculateSum").isEnabled();
    expect(result).toEqual(true);

    await app.client.element("#calculateSum").click();

    result = await app.client.element("#result").getValue();
    expect(result).toEqual(test_input[2]);
  }
});

test("Invalid input", async () => {
  var inputs = [
    [6, " "],
    [0, "aa"],
    ["b", 7],
    [1, "-4-5"],
    ["3.56.4", 6],
    ["-.7", 5],
    ["-2", "6$"],
    ["1.5-7", 3]
  ];

  // run through all test cases
  for (i = 0; i < inputs.length; i++) {
    let test_input = inputs[i];

    await app.client.element('//input[@id="input1"]').setValue(test_input[0]);
    await app.client.element('//input[@id="input2"]').setValue(test_input[1]);

    let result = await app.client.element("#calculateSum").isEnabled();
    expect(result).toEqual(false);
  }
});
