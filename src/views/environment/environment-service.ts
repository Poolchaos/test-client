import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject
export class EnvironmentService {
  
  constructor(
    private httpClient: HttpClient
  ) {}

  public getEnvironments(): Promise<any> {
    return this.httpClient
      .createRequest(`environments`)
      .asGet()
      .send();
  }

  public createEnvironment(name: string, url: string): Promise<any> {
    return this.httpClient
      .createRequest(`environments`)
      .asPost()
      .withContent({ name, url })
      .send()
      .then(response => { return JSON.parse(response.response); });
  }

  public deleteEnvironment(environmentId: string): Promise<any> {
    return this.httpClient
      .createRequest(`environments/${environmentId}`)
      .asDelete()
      .send();
  }
}
