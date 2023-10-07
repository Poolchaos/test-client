import moment from 'moment';

export class TimeAgoValueConverter {
  toView(value) {
    const now = moment();
    const date = moment(value, 'DD/MM/YYYY HH:mm:ss');

    if (now.diff(date, 'days') < 1) {
      return date.fromNow(); // Format as "time ago" for less than a day
    } else {
      return date.format('DD/MM/YYYY HH:mm:ss'); // Format as date and time
    }
  }
}
