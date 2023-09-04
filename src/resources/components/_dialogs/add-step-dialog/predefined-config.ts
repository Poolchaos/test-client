import { STEP_CONSTANTS } from "../../../../views/test-creator/steps/step-constants";


export const PREDEFINED_STEP_CONFIG = {
  [STEP_CONSTANTS.SIGN_IN]: [{
    name: 'wait',
    config: {
      durationInSeconds: 20
    }
  }, {
    name: 'text',
    config: {
      selector: "input[placeholder='Email']",
      value: "",
      label: 'Email'
    }
  }, {
    name: 'text',
    config: {
      selector: "input[placeholder='Password']",
      value: "",
      label: 'Password'
    }
  }, {
    name: 'click',
    config: {
      target: ".c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button",
      label: 'Sign In'
    }
  }, {
    name: 'wait',
    config: {
      durationInSeconds: 20
    }
  }, {
    name: 'expectDasboard',
    config: {
      role: ''
    }
  }]
};
