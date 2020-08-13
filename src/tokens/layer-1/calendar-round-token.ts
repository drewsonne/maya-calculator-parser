import {Token} from "../base";
import SpaceToken from "../layer-0/space-token";
import WordToken from "../layer-0/word-token";
import NumberToken from "../layer-0/number-token";
import {IToken} from "../i-token";
import WildcardToken from "../layer-0/wildcard-token";
import {CalendarRound, getCalendarRound, origin} from "@drewsonne/maya-dates/lib/cr/calendar-round";
import {getTzolkin, Tzolkin} from "@drewsonne/maya-dates/lib/cr/tzolkin";
import {getHaab, Haab} from "@drewsonne/maya-dates/lib/cr/haab";
import {coefficientParser as _} from "@drewsonne/maya-dates/lib/cr/component/coefficient";
import {getTzolkinDay} from "@drewsonne/maya-dates/lib/cr/component/tzolkinDay";
import {getHaabMonth} from "@drewsonne/maya-dates/lib/cr/component/haabMonth";

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
