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
    title: 'Predefined Zailab Actions',
    expanded: true,
    list: [
      { name: STEP_CONSTANTS.REGISTER, icon: 'lock' },
      { name: STEP_CONSTANTS.SIGN_IN, icon: 'key' },
    ]
  }, {
    title: 'Verify page content',
    expanded: false,
    list: [
      { name: STEP_CONSTANTS.CHECK_ELEMENT_CONTENT, icon: 'pencil' },
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
      { name: STEP_CONSTANTS.REFRESH_WINDOW, icon: 'arrowSwitch' },
      // Add more navigation steps
    ]
  }, {
    title: 'User Interaction',
    expanded: true,
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
    title: 'Sub Tests',
    expanded: false,
    list: []
  }];
  
  constructor(
  private element: Element,
    private dialogService: DialogService,
  ) {}

  public bind(): void {
    if (this.testData && this.testData.steps) {
      this.definedSteps = [...this.testData.steps];
    }
  }

  public selectStepToAdd(type: string): void {
    console.log(' ::>> selectStepToAdd .>>> ', type);

    this.dialogService
      .open({ viewModel: AddStepDialog, model: type })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log(' ::>> output > ', response.output);

          this.definedSteps = this.definedSteps.concat([...response.output]);
        }
      });
  }

  public editStep(step: any): void {
    step.editing = true;
    step.editState = { ...step.config };
  }

  public cancelEditStep(step): void {
    step.editing = false;
    step.editState;
  }

  public confirmUpdateStep(step): void {

  }

  public deleteStep(step): void {
    // add confirm delete
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
