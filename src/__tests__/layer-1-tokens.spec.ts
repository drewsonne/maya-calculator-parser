import 'mocha'
import {expect} from 'chai'
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import NumberToken from "../tokens/layer-0/number-token";
import WordToken from "../tokens/layer-0/word-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import PeriodToken from "../tokens/layer-0/period-token";
import CalendarRoundFactory from "@drewsonne/maya-dates/lib/factory/calendar-round";
import {CalendarRound, origin} from "@drewsonne/maya-dates/lib/cr/calendar-round";
import LongCount from "@drewsonne/maya-dates/lib/lc/long-count";
import {Wildcard} from "@drewsonne/maya-dates/lib/wildcard";

const NT = (n: number) => new NumberToken(n)
const WT = (w: string) => new WordToken(w)
const WCT = new WildcardToken()
const PT = new PeriodToken()

describe('calendar-round token', () => {
  describe('should convert to calendar-round object', () => {
    const crs: [CalendarRoundToken, CalendarRound][] = [
      [
        CalendarRoundToken.parse([NT(4), WT('Ajaw'), NT(8), WT('Kumk\'u')]),
        origin
      ],
      [
        CalendarRoundToken.parse([WCT, WT('Ajaw'), NT(8), WT('Kumk\'u')]),
        new CalendarRoundFactory().parse('*Ajaw 8 Kumk\'u')
      ]
    ]
    crs.forEach((args) => {
      const [crt, cr] = args
      it(`${crt}.calendarRound -> ${cr}`, () => {
        expect(crt.calendarRound).to.eq(cr)
      })
    })
  })
})

describe('long-count token', () => {
  describe('should convert to long-count object', () => {
    const lcs: [LongCountToken, LongCount][] = [
      [
        LongCountToken.parse([NT(9), PT, NT(2), PT, NT(10), PT, NT(10), PT, NT(10)]),
        new LongCount(10, 10, 10, 2, 9)
      ],
      [
        LongCountToken.parse([WCT, PT, NT(2), PT, NT(10), PT, NT(10), PT, NT(10)]),
        new LongCount(10, 10, 10, 2, new Wildcard())
      ]
    ]
    lcs.forEach((args) => {
      const [lct, lc] = args
      it(`${lct}.longCount --> ${lc}`, () => {
        const parsedLc = lct.longCount
        const result = parsedLc.equal(lc)
        expect(result).to.be.true
      })
    })
  })
})
