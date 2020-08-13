import {Token} from "../base";
import {IToken} from "../i-token";
import CalendarRoundToken from "../layer-1/calendar-round-token";
import {isCalendarRoundWildcardOperationToken} from "../../parsers/layer-2-test";

export default class CalendarRoundWildcardOperationToken extends Token<CalendarRoundToken> {
  equal(otherToken: IToken): boolean {
    if (isCalendarRoundWildcardOperationToken(otherToken)) {
      return otherToken.value.equal(this.value)
    }
    return false;
  }

  static parse(calendarRoundToken: CalendarRoundToken): CalendarRoundWildcardOperationToken {
    if (calendarRoundToken.isPartial()) {
      return new CalendarRoundWildcardOperationToken(calendarRoundToken)
    }
    throw new Error(`Could not parse: '${calendarRoundToken}'`)
  }
}
