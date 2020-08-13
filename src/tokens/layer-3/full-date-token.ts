import {Token} from "../base";
import CalendarRoundToken from "../layer-1/calendar-round-token";
import LongCountToken from "../layer-1/long-count-token";
import {IToken} from "../i-token";

export default class FullDateToken extends Token<[CalendarRoundToken, LongCountToken]> {
  equal(otherToken: IToken): boolean {
    if (otherToken instanceof FullDateToken) {
      return otherToken.value[0].equal(this.value[0]) &&
        otherToken.value[1].equal(this.value[1])
    }
    return false;
  }

  static parse(former: CalendarRoundToken, latter: LongCountToken): FullDateToken {
    return new FullDateToken([former, latter])
  }
}
