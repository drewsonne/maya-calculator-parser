import {Token} from "../base";
import SpaceToken from "../layer-0/space-token";
import WordToken from "../layer-0/word-token";
import NumberToken from "../layer-0/number-token";
import {IToken} from "../i-token";
import WildcardToken from "../layer-0/wildcard-token";
import {
  CalendarRound,
  getCalendarRound,
  calendarRoundOrigin as origin,
  getTzolkin,
  Tzolkin,
  getHaab,
  Haab,
  coefficientParser as _,
  getTzolkinDay,
  getHaabMonth
} from '@drewsonne/maya-dates';

export default class CalendarRoundToken extends Token<IToken[]> {
  static parse(tokens: IToken[]): CalendarRoundToken {
    const spaceLess: IToken[] = tokens.filter((t) => {
      return !(t instanceof SpaceToken) && (t instanceof WordToken || t instanceof NumberToken || t instanceof WildcardToken)
    })
    return new CalendarRoundToken(spaceLess)
  }

  equal(otherToken: CalendarRoundToken): boolean {
    if (this.value.length === otherToken.value.length) {
      return otherToken.value.every(
        (otherSubToken, index) => otherSubToken.equal(this.value[index]),
        this
      )
    }
    throw new Error(`Could not parse: '${otherToken}'`)
  }

  toString(): string {
    return `[${this.value.map((t) => `${t}`).join(',')}]`
  }

  get calendarRound(): CalendarRound {
    const tzolkin: Tzolkin = getTzolkin(_(this.value[0].value), getTzolkinDay(this.value[1].value))
    const haab: Haab = getHaab(_(this.value[2].value), getHaabMonth(this.value[3].value))
    return getCalendarRound(tzolkin, haab)
  }

  isPartial(): boolean {
    return this.value.some((t) => t instanceof WildcardToken)
  }
}
