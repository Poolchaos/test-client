import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { bindable, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ICONS } from './../../resources/constants/icons';
import { ConfirmDialog } from './../../resources/components/_dialogs/confirm-dialog/confirm-dialog';

import './test-creator.scss';

@autoinject
export class TestCreator {
  private testSuiteId: string;
  private testId: string;
  public testData: any;
  public testSuiteNames: string[] = [];

  public submitting: boolean;
  public submitted: boolean;
  
  public icons = ICONS;

  public steps: any = [
    { name: '1', complete: false, active: false, partial: false },
    { name: '2', complete: false, active: false, partial: false },
    { name: '3', complete: false, active: false, partial: false }
  ];
  public activeStep: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService
  ) {}

  public activate(params: { testSuiteId: string; testId: string; }): void {
    this.testSuiteId = params.testSuiteId;
    this.testId = params.testId;
    console.log(' ::>> testSuiteId >>> ', params);
    
    this.activateStep(2);

    if (this.testId) {
      this.getTest();
    } else {
      this.testData = {};
    }
  }

  private getTest(): void {
    this.httpClient
      .createRequest(`http://localhost:9000/testsuites/${this.testSuiteId}/test/${this.testId}`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.testData = JSON.parse(data.response);
          console.log(' ::>> this.testData >>> ', this.testData);
        } catch(e) {
          console.log(' > Failed to get test for creator', e);
        }
      });
  }

  private activateStep(step: number): void {
    this.activeStep = this.steps[step];
    this.steps[step].active = true;
  }

  public completeStep(step: number): void {
    this.steps[step].complete = true;
    this.steps[step].active = false;

    if (this.steps[step + 1]) {
      this.activateStep(step + 1);
    } else {
      if (this.testData.testid) {
        this.updateTest();
      } else {
        this.createTest();
      }
    }
  }

  private updateTest(): void {
    // todo: still implement
  }

  private createTest(): void {
    console.log(' ::>> testData >>>>> ', this.testData);
    this.submitting = true;

    this.httpClient
      .createRequest('http://localhost:9000/testsuites/' + this.testSuiteId)
      .asPost()
      .withContent(this.testData)
      .send()
      .then(() => {
        this.eventAggregator.publish('toastr:success', this.testData.name + ' has been successfully created.');
        this.router.navigate('studio');
      })
      .catch(e => {
        console.error(' > Failed to submit new test due to', e);
        this.submitting = false;
      })
  }

  public stepBack(step: number): void {
    console.log(' ::>> step back');
    this.steps[step].active = false;
    this.activateStep(step - 1);
  }

  public close(): void {
    this.dialogService
      .open({ viewModel: ConfirmDialog, model: 'You will lose any unsaved changes.' })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.router.navigate('studio');
        }
      });
  }
}
