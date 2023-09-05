import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import Prism from 'prismjs';

import './view-test-result.scss';

@autoinject
export class ViewTestResult {
  private testId: string;
  private testName: string;
  private testResultId: string;

  public testResult;
  public tests;

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
      .createRequest(`http://localhost:9000/automate/results/${this.testId}`)
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

  public encodeImage = (imageBuffer: ArrayBufferLike) => {
    const imageByteArray = new Uint8Array(imageBuffer);
    const blob = new Blob([imageByteArray], { type: 'image/png' });
    const dataURL = URL.createObjectURL(blob);
    return imageByteArray;
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
