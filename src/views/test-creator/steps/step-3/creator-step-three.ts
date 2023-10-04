import { bindable, inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

import { STEP_CONSTANTS } from '../step-constants';
import { ICONS } from './../../../../resources/constants/icons';
// import { AddStepDialog } from './dialogs/add-step-dialog/add-step-dialog';
// import { WaitConfigDialog } from './dialogs/wait-config-dialog/wait-config-dialog';
// import { TextConfigDialog } from './dialogs/text-config-dialog/text-config-dialog';

import './creator-step-three.scss';

@inject(Element, DialogService)
export class CreatorStepThree {
  @bindable({ attribute: 'test-data' }) testData: any;
  @bindable submitting: boolean;

  public icons = ICONS;
  public definedSteps = [];
  public newStep;

  public steps = [{
    title: 'Wait',
    expanded: true,
    list: [
      { name: 'Wait until the app loads', type: 'wait', icon: 'clock' },
      { name: 'Wait for dashboard', type: 'wait', icon: 'clock', disabled: true },
      { name: 'Wait for some time', type: 'wait', icon: 'clock', disabled: true },
    ]
  }, {
    title: 'Prompt User input',
    expanded: true,
    list: [
      { name: 'text', type: 'prompt', icon: 'text' },
      // { name: 'number', type: 'prompt', icon: 'numbers', disabled: true },
      { name: 'date', type: 'prompt', icon: 'calendar', disabled: true },
      // { name: 'single selection', type: 'prompt', icon: 'radioButton', disabled: true },
      // { name: 'multiple selection', type: 'prompt', icon: 'checkbox', disabled: true },
      // Add more prompt steps
    ]
  }, {
    title: 'User Interaction',
    expanded: true,
    list: [
      { name: 'click', type: 'interact', icon: 'click' },
      { name: STEP_CONSTANTS.HOVER_OVER_ELEMENT, type: 'interact', icon: 'mouse', disabled: true },
      { name: STEP_CONSTANTS.PRESS_KEY, type: 'interact', icon: 'keyboard', disabled: true },
      { name: STEP_CONSTANTS.DOUBLE_CLICK_ELEMENT, type: 'interact', icon: 'doubleClick', disabled: true },
      // { name: STEP_CONSTANTS.SCROLL_PAGE, type: 'interact', icon: 'upDownArrow', disabled: true },
      // Add more user interaction steps
    ]
  }, {
    title: 'Verify page content',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.CHECK_ELEMENT_CONTENT, icon: 'magnifyingGlass', disabled: true },
      { name: STEP_CONSTANTS.CHECK_ELEMENT_ATTRIBUTE, icon: 'magnifyingGlass', disabled: true },
      { name: STEP_CONSTANTS.CHECK_ELEMENT_PRESENCE, icon: 'roundedCheckMark', disabled: true },
      { name: STEP_CONSTANTS.CHECK_NO_TEXT_PRESENT, icon: 'ban', disabled: true },
      { name: STEP_CONSTANTS.CHECK_TEXT_PRESENCE, icon: 'checkMark', disabled: true },
      { name: STEP_CONSTANTS.CHECK_URL_CONTENT, icon: 'globe', disabled: true },
      // Add more assertion steps
    ]
  }, {
    title: 'Navigation Steps',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.OPEN_NEW_WINDOW, icon: 'globe', disabled: true },
      { name: STEP_CONSTANTS.SWITCH_TO_WINDOW, icon: 'arrowSwitch', disabled: true },
      { name: STEP_CONSTANTS.CLOSE_WINDOW, icon: 'close', disabled: true },
      { name: STEP_CONSTANTS.REFRESH_WINDOW, icon: 'rotateArrow', disabled: true },
      // Add more navigation steps
    ]
  }, {
    title: 'API Calls',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.REQUEST, icon: 'yandex', disabled: true },
    ]
  // }, {
  //   title: 'Use a Sub Tests',
  //   expanded: true,
  //   disabled: false,
  //   list: [
  //     { name: STEP_CONSTANTS.REGISTER, icon: 'lock', disabled: true },
  //     { name: STEP_CONSTANTS.COMPLETE_REGISTRATION, icon: 'lock', disabled: true },
  //     { name: STEP_CONSTANTS.SIGN_IN, icon: 'key', disabled: true },
  //     { name: STEP_CONSTANTS.OUTBOUND_CALL, icon: 'phone' },
  //   ]
  }];
  
  constructor(
  private element: Element,
    private dialogService: DialogService,
  ) {}

  public bind(): void {
    console.log(' ::>> this.testData >>>> ', this.testData);
    if (this.testData && this.testData.steps) {
      this.definedSteps = [...this.testData.steps];
    }

    // let subTestConfig = this.steps.find(step => step.title === 'Use a Sub Tests');
    // subTestConfig.disabled = this.testData.type === 'partial';
  }


  public selectStepToAdd(name: string, type: string, step?: any): void {
    console.log(' ::>> selectStepToAdd .>>> ', type, name);
    // let modal: any = AddStepDialog;
    
    if (type === 'wait') {
      if (this.definedSteps.find(ds => ds.name === name && ds.type === type)) {
        return;
      }
      this.definedSteps.push({
        type,
        name
      });
      return;
    }

    this.newStep = {
      type,
      name
    };

    // if (type === 'wait') {
    //   this.triggerWaitStep(name, type);
    //   return;
    //   // }
    //   // modal = WaitConfigDialog;
    // } else if (type === 'prompt') {
    //   this.triggerPromptStep(name, type);
    // }
    // this.dialogService
    //   .open({ viewModel: modal, model: { name, type, step }})
    //   .whenClosed(response => {
    //     if (!response.wasCancelled) {
    //       console.log(' ::>> output > ', response.output);

    //       if (step) {
    //         this.definedSteps[this.definedSteps.indexOf(step)] = [...response.output];
    //       } else {
    //         this.definedSteps.push({...response.output});
    //         console.log(' ::>> this.definedSteps >>>> else ');
    //       }
    //       console.log(' ::>> this.definedSteps >>>> ', this.definedSteps);
    //     }
    //   });
  }

  // private triggerWaitStep(name: string, type: string): void {
  //   if (name === 'Wait until the app loads') {
  //     if (this.definedSteps.find(step => step.name === name && step.type === type)) {
  //       return;
  //     }

  //     this.newStep = {
  //       type,
  //       name
  //     };
  //   }
  // }

  // private triggerPromptStep(name: string, type: string): void {
  //   if (name === 'text') {
  //     // modal = TextConfigDialog;
  //   }
  // }

  public addStep(event: CustomEvent): void {
    console.log(' ::>> add new step >>>>> ', event.detail);
    event && event.stopPropagation();
    this.definedSteps.push({ ...event.detail });
    this.newStep = null;
  }

  public cancelStepConfig(): void {
    this.newStep = null;
  }
  
  public editStep = (step: any): void => {
    step.editing = true;
    step.editState = { ...step.config };

    console.log(' ::>> editStep => ', step);

    this.selectStepToAdd(step.name || step.groupName, step.type, step);
  }

  public cancelEditStep = (step): void => {
    step.editing = false;
    step.editState;
  }

  public confirmUpdateStep = (step): void => {

  }

  public deleteStep = (step): void => {
    // add confirm delete
    // this.definedSteps = this.definedSteps.filter()
  }

  public submit(): void {
    this.testData.steps = [...this.definedSteps];

    this.element.dispatchEvent(
      new CustomEvent('step-configured', {
        bubbles: true,
        detail: {}
      })
    );
  }

  public stepBack(): void {
    this.element.dispatchEvent(
      new CustomEvent('step-back', {
        bubbles: true,
        detail: {}
      })
    );
  }
}
