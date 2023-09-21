import { STEP_CONSTANTS } from "../../../../views/test-creator/steps/step-constants";


const nameLists = {
  firstNames: [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Ruby', 'Sam', 'Tina',
    'Uma', 'Victor', 'Wendy', 'Xander', 'Yasmine', 'Zane', 'Ava', 'Benjamin', 'Chloe', 'Daniel',
    'Ella', 'Felix', 'Georgia', 'Hannah', 'Isaac', 'Julia', 'Kai', 'Lily', 'Mason', 'Nora',
    'Oscar', 'Penelope', 'Quincy', 'Riley', 'Sophia', 'Theo', 'Ulysses', 'Violet', 'William', 'Xenia',
  ],
  lastNames: [
    'Anderson', 'Brown', 'Clark', 'Davis', 'Edwards', 'Foster', 'Garcia', 'Harris', 'Irwin', 'Johnson',
    'Kane', 'Lewis', 'Miller', 'Nelson', 'Owens', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Taylor',
    'Upton', 'Vasquez', 'Walker', 'Xu', 'Young', 'Zhang', 'Adams', 'Baker', 'Carter', 'Diaz', 'Evans',
    'Ferguson', 'Gonzalez', 'Hernandez', 'Ingram', 'Jones', 'Kramer', 'Lee', 'Martin', 'Nixon', 'Ortega',
    'Perez', 'Quintero', 'Ramirez', 'Sanchez', 'Thompson', 'Uribe', 'Vargas', 'Williams', 'Xiong', 'Yates',
  ],
};

// Function to generate a random first name
function generateRandomFirstName() {
  return nameLists.firstNames[Math.floor(Math.random() * nameLists.firstNames.length)];
}

// Function to generate a random last name
function generateRandomLastName() {
  return nameLists.lastNames[Math.floor(Math.random() * nameLists.lastNames.length)];
}

const makeOutboundCallData = [ {
  name: 'Click Element',
  config: {
    selector: ".c-controller-tab.c-controller-tab--bottom",
    targetType: 'button',
    label: '+ (Create new Contact Card)'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='Search Contact']",
    value: 'Tom',
    label: 'Search Contact'
  }
}, {
  name: 'Press Keyboard Key',
  config: {
    selector: "enter"
  }
}, {
  name: 'wait',
  config: {
    durationInSeconds: 3
  }
}, {
  name: 'Click Element',
  config: {
    selector: ".search-results ul li.result-item",
    targetType: 'tile',
    label: 'Tom Johnson'
  }
}, {
  name: 'wait',
  config: {
    durationInSeconds: 5
  }
}, {
  name: 'Expect Content',
  config: {
    selector: '.c-dial-button.c-dial-button--size-small.c-dial-button--background-green',
    label: 'Click to dial button'
  }
}, {
  name: 'Click Element',
  config: {
    selector: ".c-dial-button.c-dial-button--size-small.c-dial-button--background-green",
    targetType: 'button',
    label: 'Click-To-Dial'
  }
}, {
  name: 'wait',
  config: {
    durationInSeconds: 20
  }
}, {
  name: 'Expect Content',
  config: {
    selector: `.o-hud-statusbar__level.o-hud-statusbar__level--two-front.u-text-style__size--large is-conversing`,
    label: 'Conversing State'
  }
}];

export const CALL_STEP_CONFIG = {
  [STEP_CONSTANTS.OUTBOUND_CALL]: makeOutboundCallData,
};
