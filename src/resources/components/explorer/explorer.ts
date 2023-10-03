import { DialogService } from 'aurelia-dialog';
import { bindable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ICONS } from './../../constants/icons';
import { ConfirmDialog } from '../_dialogs/confirm-dialog/confirm-dialog';
import { NewTestSuiteDialog } from '../new-test-suite-dialog/new-test-suite-dialog';

import './explorer.scss';

interface ITestSuite {
  _id: string;
  name: string;
  tests: {
    testId: string;
    name: string;
    type: string;
  }[];
  isExpanded?: boolean;
  showMenu?: boolean;
}

@inject(Element, HttpClient, DialogService, EventAggregator)
export class Explorer {

  @bindable({ attribute: 'test-suites' }) public testSuites: ITestSuite[] = [];
  @bindable({ attribute: 'sub-tests' }) public subTests: ITestSuite[] = [];
  @bindable({ attribute: 'test-suite-names' }) public testSuiteNames: string[] = [];
  public isTopLevelExpanded: boolean = true;
  public isSubMenuExpanded: boolean = true;

  public icons = ICONS;
  private rootMenuCloseTimer;
  private menuCloseTimer;
  private subMenuCloseTimer;
  private showRootMenu;
  private showSubMenu;

  constructor(
    private element: Element,
    private httpClient: HttpClient,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator
  ) {}
  
  public async bind(): Promise<void> {
    console.log(' ::>> data-check => ', this.testSuites);

    this.testSuites.forEach(ts => {
      ts.isExpanded = true;
    });
  }

  public toggleTopLevel(): void {
    this.isTopLevelExpanded = !this.isTopLevelExpanded;
  }

  public toggleSubtestsLevel(): void {
    this.isSubMenuExpanded = !this.isSubMenuExpanded;
  }

  public toggleSubItem(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();
    testSuite.isExpanded = !testSuite.isExpanded;
  }

  public selectTest(testSuiteId: string, test, event: Event): void {
    event && event.stopPropagation();

    this.element.dispatchEvent(
      new CustomEvent('select-file', {
        bubbles: true,
        detail: {
          testSuiteId,
          ...test
        }
      })
    );
  }

  // Root folder
  public toggleRootMenu(event: Event): void {
    event && event.stopPropagation();
    this.showRootMenu = !this.showRootMenu;
  }

  public rootMenuEnter(): void {
    window.clearTimeout(this.rootMenuCloseTimer);
  }

  public rootMenuLeave(): void {
    this.rootMenuCloseTimer = setTimeout(() =>{
      this.showRootMenu = false;
    }, 500);
  }

  // Sub folders folder
  public toggleMenu(testSuite: ITestSuite, event: Event): void {
    event && event.stopPropagation();
    this.testSuites.forEach(test => {
      if (test._id !== testSuite._id)
      test.showMenu = false
    });

    testSuite.showMenu = !testSuite.showMenu;
  }

  public menuEnter(): void {
    window.clearTimeout(this.menuCloseTimer);
  }

  public menuLeave(testSuite: ITestSuite): void {
    this.menuCloseTimer = setTimeout(() =>{
      testSuite.showMenu = false;
    }, 500);
  }
  
  public toggleSubMenu(event: Event): void {
    event && event.stopPropagation();
    this.showSubMenu = !this.showSubMenu;
  }

  public subMenuEnter(): void {
    window.clearTimeout(this.subMenuCloseTimer);
  }

  public subMenuLeave(): void {
    this.subMenuCloseTimer = setTimeout(() =>{
      this.showSubMenu = false;
    }, 500);
  }

  public showCreateNewFolder(event: Event): void {
    event && event.stopPropagation();
    console.log(' ::>> showCreateNewFolder >>>>> ');
    
    this.dialogService
      .open({ viewModel: NewTestSuiteDialog })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.createTestSuite(response.output);
        }
      });
  }

  private createTestSuite(name: string): void {
    console.log(' ::>> createTestSuite ', name);
    try {
      this.httpClient
        .createRequest('testsuites')
        .asPost()
        .withContent({ name })
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

  public startAddTest(event: Event, testSuite?: ITestSuite): void {
    event && event.stopPropagation();
    
    this.element.dispatchEvent(
      new CustomEvent('create-test-for-suite', {
        bubbles: true,
        detail: testSuite ? {
          testSuiteId: testSuite._id,
          testSuiteName: testSuite.name
        } : {}
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

  public showConfirmDeleteTest(testSuiteId, test: { testId: string, name: string }, event: Event): void {
    event && event.stopPropagation();
    
    this.dialogService
      .open({ viewModel: ConfirmDialog, model: `This will delete you test ${test.name}` })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.deleteTest(testSuiteId, test.testId);
        }
      });
  }
  
  public deleteTest(testSuiteId, testId: string): void {
    this.httpClient
      .createRequest('testsuites/' + testSuiteId + '/test/' + testId)
      .asDelete()
      .send()
      .then(() => {
        this.eventAggregator.publish('close-tab', testId);
        this.testSuites.find(testSuite => {
          if (testSuite._id === testSuiteId) {
            testSuite.tests = testSuite.tests.filter(test => test.testId !== testId);
          }
        });
      })
      .catch(e => console.warn(' > Failed to create test suite due to:', e))
  }

  public showConfirmDeleteSubTest(test: { _id: string, name: string }, event: Event): void {
    console.log(' ::>> test >>>> ', test)
    event && event.stopPropagation();
    
    this.dialogService
      .open({ viewModel: ConfirmDialog, model: `This will delete you test ${test.name}` })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.deleteSubTest(test._id);
        }
      });
  }
  
  public deleteSubTest(testId: string): void {
    this.httpClient
      .createRequest(`sub-tests/${testId}`)
      .asDelete()
      .send()
      .then(() => {
        console.log(' ::>> deleted sub-test ');
        this.eventAggregator.publish('close-tab', testId);
        this.subTests = this.subTests.filter(test => test._id !== testId);
      })
      .catch(e => console.warn(' > Failed to create test suite due to:', e))
  }
}
