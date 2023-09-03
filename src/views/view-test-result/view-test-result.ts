import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import moment from 'moment';

import './view-test-result.scss';

@autoinject
export class ViewTestResult {
  private testId: string;
  private testName: string;
  private testResultId: string;

  public testResult;

  constructor(
    private httpClient: HttpClient
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
      .createRequest(`http://localhost:9000/testresults/${this.testId}`)
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

          testResult.startTime = moment(testResult.startTime).format('DD/MM/YYYY HH:mm:ss');
          testResult.endTime = moment(testResult.endTime).format('DD/MM/YYYY HH:mm:ss');
          testResult.testPassed = testResult.passed === testResult.total;

          this.testResult = testResult;
        } catch(e) {
          console.error(e);
        }
      });
  }
  
  public formatTime(time: string): string {
    return moment(time).format('ddd, DD MMM YYYY [00:00:00 GMT]');
  }

  public diffTime(startTime: string, endTime: string): string {
    const startMoment = moment(startTime);
    const endMoment = moment(endTime);

    // Calculate the difference between the two moments
    const duration = moment.duration(endMoment.diff(startMoment));

    // Format the duration as desired
    const formattedDuration = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;

    return formattedDuration;
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

  // public showErrorLine(error: string): void {
  //   this.config.steps.forEach(step => step.error = false);

  //   let errorLine = this.findErrorLine(error);
  //   console.log(' ::>> showErrorLine >>>> ', errorLine);

  //   let matches = errorLine.match(/(\w+)\s*\(\s*'([\w\s\.-]+)'\s*\)/);

  //   if (matches && matches.length === 3) {
  //     let action = matches[1];
  //     let value = matches[2];

  //     console.log("Action:", action);
  //     console.log("Value:", value);

      
  //     let brokenStep = this.config.steps.find(step => step.config.selector === value);

  //     brokenStep.error = true;

  //     console.log(' ::>> brokenStep = ', brokenStep)
  //   } else {
  //     console.log("Unable to extract action and value.");
  //   }
  // }
}
