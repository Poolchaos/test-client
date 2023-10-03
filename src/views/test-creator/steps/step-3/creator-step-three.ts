import { bindable, inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

import { AddStepDialog } from '../../../../resources/components/_dialogs/add-step-dialog/add-step-dialog';
import { STEP_CONSTANTS } from '../step-constants';
import { ICONS } from './../../../../resources/constants/icons';

import './creator-step-three.scss';

@inject(Element, DialogService)
export class CreatorStepThree {
  @bindable({ attribute: 'test-data' }) testData: any;
  @bindable submitting: boolean;

  public icons = ICONS;
  public definedSteps = [];

  public steps = [{
    title: 'Verify page content',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.CHECK_ELEMENT_CONTENT, icon: 'magnifyingGlass' },
      { name: STEP_CONSTANTS.CHECK_ELEMENT_ATTRIBUTE, icon: 'magnifyingGlass' },
      { name: STEP_CONSTANTS.CHECK_ELEMENT_PRESENCE, icon: 'roundedCheckMark' },
      { name: STEP_CONSTANTS.CHECK_NO_TEXT_PRESENT, icon: 'ban' },
      { name: STEP_CONSTANTS.CHECK_TEXT_PRESENCE, icon: 'checkMark' },
      { name: STEP_CONSTANTS.CHECK_URL_CONTENT, icon: 'globe' },
      // Add more assertion steps
    ]
  }, {
    title: 'Navigation Steps',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.OPEN_NEW_WINDOW, icon: 'globe' },
      { name: STEP_CONSTANTS.SWITCH_TO_WINDOW, icon: 'arrowSwitch' },
      { name: STEP_CONSTANTS.CLOSE_WINDOW, icon: 'close' },
      { name: STEP_CONSTANTS.REFRESH_WINDOW, icon: 'rotateArrow' },
      // Add more navigation steps
    ]
  }, {
    title: 'User Interaction',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.HOVER_OVER_ELEMENT, icon: 'mouse' },
      { name: STEP_CONSTANTS.PRESS_KEY, icon: 'keyboard' },
      { name: STEP_CONSTANTS.CLICK_ELEMENT, icon: 'click' },
      { name: STEP_CONSTANTS.DOUBLE_CLICK_ELEMENT, icon: 'doubleClick' },
      { name: STEP_CONSTANTS.SCROLL_PAGE, icon: 'upDownArrow' },
      { name: STEP_CONSTANTS.WAIT, icon: 'hourGlass' },
      // Add more user interaction steps
    ]
  }, {
    title: 'Prompts',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.TEXT_INPUT, icon: 'box' },
      { name: STEP_CONSTANTS.NUMBER_INPUT, icon: 'numbers' },
      { name: STEP_CONSTANTS.DATE_INPUT, icon: 'hourGlass' },
      { name: STEP_CONSTANTS.RADIO_BUTTON, icon: 'radioButton' },
      { name: STEP_CONSTANTS.CHECKBOX, icon: 'checkbox' },
      // Add more prompt steps
    ]
  }, {
    title: 'API Calls',
    expanded: true,
    list: [
      { name: STEP_CONSTANTS.REQUEST, icon: 'yandex' },
    ]
  }, {
    title: 'Use a Sub Tests',
    expanded: true,
    disabled: false,
    list: [
      { name: STEP_CONSTANTS.REGISTER, icon: 'lock' },
      { name: STEP_CONSTANTS.COMPLETE_REGISTRATION, icon: 'lock' },
      { name: STEP_CONSTANTS.SIGN_IN, icon: 'key' },
      { name: STEP_CONSTANTS.OUTBOUND_CALL, icon: 'phone' },
    ]
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

    let subTestConfig = this.steps.find(step => step.title === 'Use a Sub Tests');
    subTestConfig.disabled = this.testData.type === 'partial';
  }


  public selectStepToAdd(type: string, step?: any): void {
    console.log(' ::>> selectStepToAdd .>>> ', type);

    this.dialogService
      .open({ viewModel: AddStepDialog, model: { type, step }})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log(' ::>> output > ', response.output);

          if (step) {
            this.definedSteps[this.definedSteps.indexOf(step)] = [...response.output];
          } else {
            this.definedSteps = this.definedSteps.concat([...response.output]);
          }
          console.log(' ::>> this.definedSteps >>>> ', this.definedSteps);
        }
      });
  }

  public editStep = (step: any): void => {
    step.editing = true;
    step.editState = { ...step.config };

    console.log(' ::>> editStep => ', step);

    this.selectStepToAdd(step.name || step.groupName, step);
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
