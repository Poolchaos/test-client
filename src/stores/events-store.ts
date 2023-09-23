import { autoinject } from 'aurelia-framework';

import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject()
export class EventsStore {

  constructor(private eventAggregator: EventAggregator) {}
  
  public subscribeAndPublish(
    pubEvt: string,
    subEvt: string,
    pubData: any,
    subCallback: (data?: any) => any): void {

      if (!pubEvt || !subEvt || !pubData || !subCallback) {
        console.warn('subscribeAndPublish | you are missing fields ');
        return;
      }

      const sub = this.eventAggregator.subscribe(subEvt, (data: any) => {
        sub && sub.dispose();
        subCallback(data);
      });
      this.eventAggregator.publish(pubEvt, pubData);
    }
}
