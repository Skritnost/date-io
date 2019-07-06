import Moment from "moment";
import iMoment from "moment-hijri";
import DefaultMomentUtils from "@date-io/moment";

var symbolMap = {
  1: "١",
  2: "٢",
  3: "٣",
  4: "٤",
  5: "٥",
  6: "٦",
  7: "٧",
  8: "٨",
  9: "٩",
  0: "٠"
};

interface Opts {
  /** @deprecated */
  moment?: typeof iMoment;
  instance?: typeof iMoment;
}

type Moment = iMoment.Moment;

export default class MomentUtils extends DefaultMomentUtils {
  public moment: typeof iMoment;

  public locale?: string;

  public dateTime12hFormat = "iD iMMMM hh:mm a";

  public dateTime24hFormat = "iD iMMMM HH:mm";

  public time12hFormat = "hh:mm A";

  public time24hFormat = "HH:mm";

  public dateFormat = "iD iMMMM";

  constructor({ moment, instance }: Opts = {}) {
    super({ locale: "ar-SA", moment });

    this.moment = instance || moment || iMoment;
    this.locale = "ar-SA";
  }

  private toIMoment(date?: any) {
    return this.moment(date ? date.clone() : undefined).locale("ar-SA");
  }

  public parse(value: string, format: string) {
    if (value === "") {
      return null;
    }

    return this.moment(value, format, true).locale("ar-SA");
  }

  public date(value?: any) {
    if (value === null) {
      return null;
    }

    return this.moment(value).locale("ar-SA");
  }

  public isBeforeYear(date: Moment, value: Moment) {
    return date.iYear() < value.iYear();
  }

  public isAfterYear(date: Moment, value: Moment) {
    return date.iYear() > value.iYear();
  }

  public getMonth(date: Moment) {
    return date.iMonth();
  }

  public startOfMonth(date: Moment) {
    return date.clone().startOf("iMonth");
  }

  public endOfMonth(date: Moment) {
    return date.clone().endOf("iMonth");
  }

  public getNextMonth(date: Moment) {
    return date.clone().add(1, "iMonth");
  }

  public getPreviousMonth(date: Moment) {
    return date.clone().subtract(1, "iMonth");
  }

  public getYear(date: Moment) {
    return date.iYear();
  }

  public setYear(date: Moment, year: number) {
    return date.clone().iYear(year);
  }

  public getMeridiemText(ampm: "am" | "pm") {
    return ampm === "am"
      ? this.toIMoment()
        .hours(2)
        .format("A")
      : this.toIMoment()
        .hours(14)
        .format("A");
  }

  public getWeekdays() {
    return [0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
      return this.toIMoment()
        .weekday(dayOfWeek)
        .format("dd");
    });
  }

  public isEqual(value: any, comparing: any) {
    if (value === null && comparing === null) {
      return true;
    }

    return this.moment(value).isSame(comparing);
  }

  public formatNumber(num: string) {
    return num.replace(/\d/g, match => symbolMap[match]).replace(/,/g, "،");
  }

  public getWeekArray(date: Moment) {
    const start = date
      .clone()
      .startOf("iMonth")
      .startOf("week");

    const end = date
      .clone()
      .endOf("iMonth")
      .endOf("week");

    let count = 0;
    let current = start;
    const nestedWeeks: Moment[][] = [];

    while (current.isBefore(end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = current.clone().add(1, "day");
      count += 1;
    }

    return nestedWeeks;
  }

  public getYearRange(start: Moment, end: Moment) {
    // moment-hijri only supports dates between 1356-01-01 H and 1499-12-29 H
    // We need to throw if outside min/max bounds, otherwise the while loop below will be infinite.
    if (start.isBefore("1937-03-14")) {
      throw new Error("min date must be on or after 1356-01-01 H (1937-03-14)");
    }
    if (end.isAfter("2076-11-26")) {
      throw new Error("max date must be on or before 1499-12-29 H (2076-11-26)");
    }

    const startDate = this.moment(start).startOf("iYear");
    const endDate = this.moment(end).endOf("iYear");
    const years: Moment[] = [];

    let current = startDate;
    while (current.isBefore(endDate)) {
      years.push(current);
      current = current.clone().add(1, "iYear");
    }

    return years;
  }

  // displaying methods
  public getCalendarHeaderText(date: Moment) {
    return date.format("iMMMM iYYYY");
  }

  public getYearText(date: Moment) {
    return date.format("iYYYY");
  }

  public getDatePickerHeaderText(date: Moment) {
    return date.format("dddd, iD iMMM");
  }

  public getDateTimePickerHeaderText(date: Moment) {
    return date.format("iD iMMM");
  }

  public getDayText(date: Moment) {
    return date.format("iD");
  }
}