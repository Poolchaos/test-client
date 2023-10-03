import { STEP_CONSTANTS } from "../../step-constants";

function generateRandomEmail(baseEmail) {
  // Generate a random string for the suffix
  const randomSuffix = Math.random().toString(36).substring(2, 10);

  // Replace {suffix} with the random suffix
  const randomEmail = baseEmail.replace('{suffix}', randomSuffix);

  return randomEmail;
}

// Define longer lists of words for generating company names
const wordLists = {
  beginnings: [
    'Tech', 'Global', 'Innovative', 'Smart', 'Creative', 'Advanced', 'Dynamic', 'Strategic', 'Eco', 'Data',
    'Quantum', 'Futuristic', 'Synergistic', 'Nano', 'Digital', 'Agile', 'Robo', 'Virtual', 'Pioneer', 'NextGen',
    'Hyper', 'Mega', 'Bio', 'Super', 'Solar', 'Electric', 'BioTech', 'Info', 'NanoTech', 'Space', 'Genius',
    'Interstellar', 'Neuro', 'Green', 'GlobalTech', 'Deep', 'Cyber', 'SmartTech', 'BioInfo', 'Cloud', 'Geo',
    'Infinity', 'Rapid', 'BioDigi', 'EcoTech', 'QuantumTech', 'SpaceTech', 'HyperTech', 'SuperTech', 'Urban',
    'Vivid', 'Atomic', 'Cosmo', 'TechNova', 'Star', 'Beyond', 'Galactic', 'Infinite', 'MegaCorp', 'TechSolutions',
    'Meta', 'Synergy', 'Electro', 'Fusion', 'Swift', 'DataWise', 'DigitalHub', 'FutureScape', 'Sunrise', 'Sunset',
    'SkyHigh', 'Bright', 'NeuraTech', 'Giga', 'Futurist', 'Blue', 'White', 'Red', 'Yellow', 'GreenTech', 'Bright',
    'SmartFusion', 'NextWave', 'FutureEdge', 'QuantumLeap', 'Pioneering', 'BioGen', 'InfoSphere', 'Echo', 'Mira',
    'GenX', 'WaveTech', 'Nexa', 'Elemental', 'Opti', 'Vista', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime',
  ],
  middles: [
    'Solutions', 'Services', 'Enterprises', 'Industries', 'Group', 'Technologies', 'Innovations', 'Ventures',
    'Systems', 'Labs', 'Dynamics', 'Fusion', 'World', 'Core', 'Digital', 'Global', 'Network', 'Matrix', 'Link',
    'Space', 'Wave', 'Spectrum', 'Frontier', 'Horizon', 'Path', 'Voyage', 'Quest', 'Sphere', 'Hub', 'Nexa',
    'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo', 'Cyber', 'Link', 'Globe',
    'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite', 'Scape', 'Empire', 'Pulse',
    'Nexa', 'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo', 'Cyber', 'Link',
    'Globe', 'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite', 'Scape', 'Empire',
    'Nexa', 'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo', 'Cyber', 'Link',
    'Globe', 'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite', 'Scape', 'Empire',
  ],
  endings: [
    'Inc', 'Corp', 'Ltd', 'LLC', 'S.A.', 'Group', 'Enterprises', 'Technologies', 'Solutions', 'Services',
    'Innovations', 'Ventures', 'Systems', 'Labs', 'Dynamics', 'Fusion', 'World', 'Core', 'Digital', 'Global',
    'Network', 'Matrix', 'Link', 'Space', 'Wave', 'Spectrum', 'Frontier', 'Horizon', 'Path', 'Voyage', 'Quest',
    'Sphere', 'Hub', 'Nexa', 'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo',
    'Cyber', 'Link', 'Globe', 'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite',
    'Scape', 'Empire', 'Nexa', 'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo',
    'Cyber', 'Link', 'Globe', 'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite',
    'Scape', 'Empire', 'Nexa', 'Vista', 'Opti', 'Sync', 'Omni', 'Edge', 'PathFinder', 'Prime', 'Wave', 'Dynamo',
    'Cyber', 'Link', 'Globe', 'Planet', 'Continuum', 'Pulse', 'Orbit', 'Source', 'Stream', 'Pulse', 'Infinite',
    'Scape', 'Empire',
  ],
};

function generateRandomCompanyName() {
  const beginning = wordLists.beginnings[Math.floor(Math.random() * wordLists.beginnings.length)];
  const middle = wordLists.middles[Math.floor(Math.random() * wordLists.middles.length)];
  const ending = wordLists.endings[Math.floor(Math.random() * wordLists.endings.length)];

  return `${beginning} ${middle} ${ending}`;
}

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

const phoneNumberList = [];

for (let i = 0; i < 100; i++) {
  const phoneNumber = Math.floor(Math.random() * 9000000000 + 1000000000);
  phoneNumberList.push(phoneNumber.toString());
}
const randomIndex = Math.floor(Math.random() * phoneNumberList.length);

const registerData = [{
  name: 'wait',
  config: {
    durationInSeconds: 5
  }
}, {
  name: 'Click Element',
  config: {
    selector: "#join",
    targetType: 'button',
    label: 'Register'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='Email Address']",
    value: generateRandomEmail('flaap+{suffix}@gmail.com'),
    label: 'Email'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='Company Name']",
    value: generateRandomCompanyName(),
    label: 'Company Name'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='First Name']",
    value: generateRandomFirstName(),
    label: 'First Name'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='Last Name']",
    value: generateRandomLastName(),
    label: 'Last Name'
  }
}, {
  name: 'text',
  config: {
    selector: "input[placeholder='(201) 555-0123']",
    value: phoneNumberList[randomIndex],
    label: 'Number'
  }
}, {
  name: 'Click Element',
  config: {
    selector: `button:[text()="Register"]`,
    targetType: 'button',
    label: 'Register'
  }
}, {
  name: 'wait',
  config: {
    durationInSeconds: 5
  }
}, {
  name: 'Expect Content',
  config: {
    selector: `div:contains("Thank you. We are almost done, please check your email to complete your registration.")`,
    label: 'Registered, please check email'
  }
}];

export const PREDEFINED_REGISTER_STEP_CONFIG = {
  [STEP_CONSTANTS.REGISTER]: registerData,
};
