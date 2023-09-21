import { STEP_CONSTANTS } from "../../../../views/test-creator/steps/step-constants";

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
