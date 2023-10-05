import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { DialogService } from 'aurelia-dialog';
import Prism from 'prismjs';

import { ImageDialog } from './../../resources/components/_dialogs/image-dialog/image-dialog';

import './view-test-result.scss';

@autoinject()
export class ViewTestResult {
  private testId: string;
  private testName: string;
  private testResultId: string;

  public testResult;
  public tests;
  
  public tabs: any[] = [{
    name: 'Generated Test',
    selected: true
  }];

  constructor(
    private httpClient: HttpClient,
    private dialogService: DialogService
  ) {}

  public activate(params): void {
    console.log(' ::>> params >>> ', params);

    if (params && params.urlstring) {
      const splitParams = params.urlstring.split('-');
      this.testId = splitParams[0];
      this.testName = splitParams[1];
      this.testResultId = splitParams[2];
      
      console.log(' ::>> data >>> ', {
        testId: this.testId,
        testResultId: this.testResultId
      });

      this.getTestResult();
    }
  }

  private async getTestResult(): Promise<void> {
    this.httpClient
      .createRequest(`results/${this.testId}`)
      .asGet()
      .withParams({
        testResultId: this.testResultId
      })
      .send()
      .then(data => {
        try {
          const testResult = JSON.parse(data.response);
          console.log(' ::>> testResults >>>> ', testResult);

          if (testResult.startTime.indexOf('Z') < 0) {
            testResult.startTime = parseInt(testResult.startTime);
          }
          console.log(' ::>> result.startTime >>>> ', testResult.startTime);

          testResult.startTime = formatDateToDDMMYYYYHHMMSS(testResult.startTime);
          testResult.endTime = formatDateToDDMMYYYYHHMMSS(testResult.endTime);
          testResult.testPassed = testResult.passed === testResult.total;

          this.testResult = testResult;
          this.tests = testResult.fixtures[0].tests[0].steps;

          setTimeout(() => {
            Prism.highlight(
              testResult.generatedTest,
              Prism.languages.javascript,
              'javascript'
            );
          }, 1000)

          console.log(' ::>> this.tests >>>> ', this.tests);
        } catch(e) {
          console.error(e);
        }
      });
  }
  

  public diffTime(startTime: string, endTime: string): string {
    // const startMoment = moment(startTime);
    // const endMoment = moment(endTime);

    // // Calculate the difference between the two moments
    // const duration = moment.duration(endMoment.diff(startMoment));

    // // Format the duration as desired
    // const formattedDuration = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;

    // return formattedDuration;
    return 'diff to be determined';
  }

  public findErrorLine(errorMessage: string) {
    let response = '';
    const caretIndex = errorMessage.indexOf('>');
    if (caretIndex !== -1) {
      // Find the start of the line
      const lines = errorMessage.split('\n');

      // Find the line with the caret indicator
      const caretLine = lines.find(line => line.includes('>'));
      if (caretLine) {
        // Remove the '>' and any leading/trailing whitespace
        const cleanedLine = caretLine.replace('>', '').trim();
        response = cleanedLine;
        console.log(cleanedLine); // Output the cleaned error line
      }
    }
    return response.replace('| ', '');
  }

  public showImage = (step, number): void => {
    this.dialogService
      .open({
        viewModel: ImageDialog,
        model: { step, number }
      })
  }
}

function formatDateToDDMMYYYYHHMMSS(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
