import { AureliaConfiguration } from 'aurelia-configuration';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject
export class AppService {
  constructor(
    private httpClient: HttpClient,
    private aureliaConfiguration: AureliaConfiguration
  ) {
    this.setHeaders();
  }

  private setHeaders(): void {
    // @ts-ignore;
    const env = this.aureliaConfiguration.environment;
    const baseURL = this.aureliaConfiguration.obj[env].apiQueryEndpoint;
    this.httpClient.configure(req => {
      req.withBaseUrl(baseURL);
    });
  }
}
