import { Router } from 'aurelia-router';
import { bindable, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import moment from 'moment';

import { ICONS } from './../../constants/icons';

import './editor.scss';

interface IConfig {
  testSuiteId: string;
  testId: string;
  name: string;
  URL: string;
  browser: string;
  errorScreenshot: boolean;
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

@autoinject
export class Editor {
  @bindable({ attribute: 'config' }) public config: IConfig;

  public icons = ICONS;
  public loading: boolean = false;
  public testResults: any = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {}

  public bind() {
    console.log(' ::>> config = 1 ', this.config);
    this.getTestConfig();
    this.getTestResults();
  }

  private getTestConfig(): void {
    this.httpClient
      .createRequest(`http://localhost:9000/testsuites/${this.config.testSuiteId}/test/${this.config.testId}`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.config = JSON.parse(data.response);
          console.log(' ::>> query test data | data = ', this.config);
        } catch(e) {
          console.error(' ::>> Failed to get test config >>> ', e);
        }
      })
      .catch(e => {});
  }

  private getTestResults(): void {
    console.log(' ::>> 1693747142644 >> ', moment(1693747142644).format('DD/MM/YYYY HH:mm:ss'));


    this.httpClient
      .createRequest(`http://localhost:9000/automate/results`)
      .asGet()
      .withParams({ testId: this.config.testId })
      .send()
      .then(data => {
        try {
          const parsedData = JSON.parse(data.response);
          if (!parsedData) {
            return;
          }

          const testResults = JSON.parse(data.response).results.reverse();
          this.testResults = testResults.map(result => {

            if (result.startTime.indexOf('Z') < 0) {
              result.startTime = parseInt(result.startTime);
            }
            console.log(' ::>> result.startTime >>>> ', result.startTime);

            result.startTime = moment(result.startTime).format('DD/MM/YYYY HH:mm:ss');
            result.endTime = moment(result.endTime).format('DD/MM/YYYY HH:mm:ss');
            result.testPassed = result.passed === result.total;
            return result;
          });
          console.log(' ::>> query test results data | data = ', this.testResults);
        } catch(e) {
          console.error(' ::>> Failed to get test results >>> ', e);
        }
      })
      .catch(e => {});
  }

  public runTest(): void {
    this.loading = true;
    console.log(' ::>> run test > ', this.config);
    
    this.testResults.unshift({
      startTime: moment().format('DD/MM/YYYY HH:mm:ss'),
      ongoing: true
    });

    this.httpClient
      .createRequest('http://localhost:9000/automate')
      .asPost()
      .withContent(this.config)
      .send()
      .then(data => {
        console.log(' ::>> data >>>> ', data);
      })
      .catch(e => {
        console.error(e);
        this.loading = false;
      });
  }

  public viewTestResult(result): void {
    this.router.navigate('view-test-result/' + this.config.testId + '-' + this.config.name + '-' + result._id);
  }

  public edit(): void {
    this.router.navigate('test-wizard/' + this.config.testSuiteId + '/' + this.config.testId);
  }
}
