import { Router } from 'aurelia-router';
import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { ICONS } from 'resources/constants/icons';
import './studio.scss';

interface IConfig {
  id?: string;
  name?: string;
  URL?: string;
  browser?: string;
  errorScreenshot?: boolean;
  steps: IStep[];
}

interface IStep {
  action: string;
  config: {
    selector?: string;
    value?: string;
    target?: string;
    durationInSeconds?: number;
  }
  error?: boolean;
}

interface ITestSuite {
  _id: string;
  name: string;
  tests: {
    name: string;
  }[];
  isExpanded?: boolean;
}

@autoinject
export class Studio {

  public icons = ICONS;
  public tabs: any[] = [{
    name: 'Welcome',
    selected: true
  }];
  public testSuites: ITestSuite[];
  public testSuiteNames: string[] = [];
  public testData: IConfig = { name: '', steps: [] };
  
  public subTests: ITestSuite[];
  public subTestNames: string[] = [];

  private subscription: Subscription;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private eventAggregator: EventAggregator
  ) {}

  public activate(): void {
    this.getStoredTabs();
    this.getE2ETests();
    this.getSubTests();
    this.subscribeToInternalEvents();
  }

  private getStoredTabs(): void {
    try {
      let configString = sessionStorage.getItem('zai-test-config');
      this.tabs = JSON.parse(configString).studio.tabs;
      console.log(' ::>> this.tabs >>>> ', this.tabs);
      this.tabs.forEach(tab => this.notifyTabSelected(tab))
    } catch(e) {
      console.warn(' ::>> no previous config found. ');
    }
  }

  private async getE2ETests(): Promise<void> {
    try {
      let testData: any = await this.httpClient
        .createRequest('test-suites')
        .asGet()
        .send()
        .catch(e =>{})
      this.testSuites = JSON.parse(testData.response);
      this.testSuiteNames = this.testSuites.map(suite => suite.name);
      console.log(' ::>> testSuites ', this.testSuites);
    } catch(e) {
      console.warn(' > Failed to parse explorer data ');
    }
  }

  private async getSubTests(): Promise<void> {
    try {
      let subTestData: any = await this.httpClient
        .createRequest('sub-tests')
        .asGet()
        .send()
        .catch(e =>{})
      this.subTests = JSON.parse(subTestData.response);
      this.subTestNames = this.subTests.map(test => test.name);
      console.log(' ::>> subTests ', this.subTests);
    } catch(e) {
      console.warn(' > Failed to parse explorer data ');
    }
  }

  private subscribeToInternalEvents(): void {
    this.subscription = this.eventAggregator.subscribe('close-tab', (testId: string) => {
      this.tabs.forEach((tab, index) => {
        if (tab.testId === testId) {
          this.closeTab(index);
        }
      })
    });
    this.subscription = this.eventAggregator.subscribe('new-tab', (test) => {
      this.openTab(test);
    });
  }

  public async requestDirectorySelection(): Promise<void> {
    try {
      const file = await this.getFileFromUser();
      if (file) {
        const textContent = await this.readFileAsText(file);
        console.log(textContent);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async getFileFromUser() {
    return new Promise<File>((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.txt'; // Specify the accepted file type(s) if needed

      fileInput.addEventListener('change', (event) => {
        const selectedFile = (event.target as HTMLInputElement).files[0];
        if (selectedFile) {
          resolve(selectedFile);
        } else {
          reject(new Error('No file selected.'));
        }
      });

      fileInput.click();
    });
  }

  private async readFileAsText(file) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result as string);
      };
      reader.onerror = (event) => {
        reject(event.target.error);
      };
      reader.readAsText(file);
    });
  }

  public runAllTests(): void {
    this.httpClient
      .createRequest('automate/all')
      .asPost()
      .withContent({
        scriptName: 'test name'
      })
      .send()
      .then(data => {
        // this.testResults = data;
        // this.loading = false;
        console.log(' ::>> all tests ran ', data);
      })
      .catch(e => {
        console.error(e);
        // this.loading = false;
      });
  }

  public openTab(data: any): void {
    console.log(' ::>> openTab >>>> ', data);
    let isExistingTab = this.tabs.find(tab => {
      return (
        data.type === 'partial' && tab._id === data._id ||
        data.type === 'complete' && tab.testId === data.testId
      );
    });
    if (isExistingTab) {
      this.selectTab(isExistingTab);
      return;
    }
    this.tabs.push({...data });
    this.selectTab(this.tabs[this.tabs.length - 1]);
  }

  public selectTab(tab: any) {
    console.log(' ::>> select tab >>>>> ', tab);
    this.tabs.forEach(_tab => {
      console.log(' ::>> tab >>>>> ', _tab);
      if (
        tab.type === 'partial' && tab._id === _tab._id ||
        tab.type === 'complete' && tab.testId === _tab.testId
      ) {
        console.log(' ::>> tab >>>>> matches >>>>> ', { tab, _tab });
        _tab.selected = true;
        tab.selected = true;
        this.notifyTabSelected(_tab);
      } else {
        if (_tab.selected) {
          _tab.selected = false;
          this.notifyTabDeSelected(_tab);
        }
        console.log(' ::>> tab >>>>> deselect tab >>>>> ', _tab);
        _tab.selected = false;
      }
    });
    
    sessionStorage.setItem('zai-test-config', JSON.stringify({
      studio: {
        tabs: this.tabs
      }
    }));
  }

  private notifyTabSelected(tab: any): void {

    let explorer = document.querySelector('explorer');
    if (!explorer) {
      setTimeout(() => this.notifyTabSelected(tab), 1000);
      return;
    }

    if (tab.name !== 'Welcome') {
      if (tab.type === 'complete') {
        this.eventAggregator.publish('select-test-tab', tab);
      } else if (tab.type === 'partial') {
        this.eventAggregator.publish('select-sub-test-tab', tab);
      }
    }
  }

  private notifyTabDeSelected(tab: any): void {

    let explorer = document.querySelector('explorer');
    if (!explorer) {
      setTimeout(() => this.notifyTabSelected(tab), 1000);
      return;
    }

    if (tab.name !== 'Welcome') {
      if (tab.type === 'complete') {
        this.eventAggregator.publish('deselect-test-tab', tab);
      } else if (tab.type === 'partial') {
        this.eventAggregator.publish('deselect-sub-test-tab', tab);
      }
    }
  }

  public closeTab(index: number, event?: Event): void {
    event && event.stopPropagation();

    if (this.tabs[index].type === 'complete') {
      this.eventAggregator.publish('close-test-tab', this.tabs[index]);
    } else if (this.tabs[index].type === 'partial') {
      this.eventAggregator.publish('close-sub-test-tab', this.tabs[index]);
    }

    // todo: check for changes for test tabs
    if (this.tabs[index].selected && this.tabs.length > 0) {
      this.selectTab(this.tabs[0])
    }

    this.tabs.splice(index, 1);

    sessionStorage.setItem('zai-test-config', JSON.stringify({
      studio: {
        tabs: this.tabs
      }
    }));
  }

  public startCreateTestForSuiteFlow(data: { testSuiteId: string; testSuiteName: string; }) {
    console.log(' ::>> startCreateTestForSuiteFlow >>>>> ', data);
    this.router.navigate('test-wizard' + (data.testSuiteId ? '/' + data.testSuiteId : '/sub-test'));
  }
}
