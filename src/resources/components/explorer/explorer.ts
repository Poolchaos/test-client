import { DialogService } from 'aurelia-dialog';
import { bindable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-dependency-injection';

import { ICONS } from './../../constants/icons';

import './explorer.scss';
import { ConfirmDialog } from '../_dialogs/confirm-dialog/confirm-dialog';

declare let require: any;

interface ITestSuite {
  _id: string;
  name: string;
  tests: {
    name: string;
  }[];
  isExpanded?: boolean;
  showMenu?: boolean;
}

@inject(Element, HttpClient, DialogService)
export class Explorer {

  @bindable({ attribute: 'test-suites' }) public testSuites: ITestSuite[] = [];
  @bindable({ attribute: 'test-suite-names' }) public testSuiteNames: string[] = [];
  public isTopLevelExpanded: boolean = true;

  public icons = ICONS;
  private menuCloseTimer;

  constructor(
    private element: Element,
    private httpClient: HttpClient,
    private dialogService: DialogService
  ) {}
  
  public async bind(): Promise<void> {
    console.log(' ::>> data-check => ', this.testSuites);

    this.testSuites.forEach(ts => {
      ts.isExpanded = true;
    });

    // try {
    //   let testData: any = await this.httpClient
    //     .createRequest('tests')
    //     .asGet()
    //     .send()
    //     .catch(e =>{})

    //   this.testSuites = JSON.parse(testData.response);
    //   this.testSuiteNames = this.testSuites.map(suite => suite.name);
    //   console.log(' ::>> testSuites ', this.testSuites);
    // } catch(e) {
    //   console.warn(' > Failed to parse explorer data ');
    // }
  }

  public toggleTopLevel(): void {
    this.isTopLevelExpanded = !this.isTopLevelExpanded;
  }

  public toggleSubItem(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();
    testSuite.isExpanded = !testSuite.isExpanded;
  }

  private debounceTimeout = null;
  public selectTest(testSuiteId: string, test, event: Event): void {
    event && event.stopPropagation();

    if (this.debounceTimeout !== null) {
      // Double-click action
      console.log('Double-clicked!');
      this.element.dispatchEvent(
        new CustomEvent('select-file', {
          bubbles: true,
          detail: {
            testSuiteId,
            ...test
          }
        })
      );

      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    } else {
      // First click, start debounce timer
      this.debounceTimeout = setTimeout(() => {
        this.debounceTimeout = null;
        // Single-click action
        console.log('Single-clicked!');
      }, 300); // Adjust the debounce time as needed
    }
  }

  public toggleMenu(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();
    this.testSuites.forEach(test => {
      if (test._id !== testSuite._id)
      test.showMenu = false
    });

    testSuite.showMenu = !testSuite.showMenu
  }

  public menuEnter(): void {
    window.clearTimeout(this.menuCloseTimer);
  }

  public menuLeave(testSuite: ITestSuite): void {
    this.menuCloseTimer = setTimeout(() =>{
      testSuite.showMenu = false;
    }, 500);
  }

  public createTestSuite(data: any): void {
    console.log(' ::>> createTestSuite ', data);
    try {
      this.httpClient
        .createRequest('testsuites')
        .asPost()
        .withContent({ name: data })
        .send()
        .then(response => {
          try {
            const testSuite = JSON.parse(response.response);
            console.log(' ::>> test suite added => ', testSuite);
            this.testSuites.push({ ...testSuite, isExpanded: true });
          } catch(e) {
            console.warn(' > Failed to parse new test suite data due to', e);
          }

        })
        .catch(e => console.warn(' > Failed to create test suite due to:', e))
    } catch(e) {
      console.warn(' > Failed to create test suite due to:', e);
    }
  }

  public startAddTest(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();
    console.log(' ::>> add test for ', testSuite);
    
    this.element.dispatchEvent(
      new CustomEvent('create-test-for-suite', {
        bubbles: true,
        detail: {
          testSuiteId: testSuite._id,
          testSuiteName: testSuite.name
        }
      })
    );
  }
  
  public deleteTestSuite(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();

    this.dialogService
      .open({ viewModel: ConfirmDialog, model: 'This will delete your test suite: ' + testSuite.name })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.httpClient
            .createRequest('testsuites/' + testSuite._id)
            .asDelete()
            .send()
            .then(() => {
              this.testSuites = this.testSuites.filter(_testSuite => _testSuite._id !== testSuite._id);
            })
            .catch(e => console.warn(' > Failed to create test suite due to:', e))
        }
      });
  }
}
