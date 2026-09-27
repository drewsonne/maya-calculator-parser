import {expect} from 'chai'
import 'mocha'
import {parse} from '../index'
import TokenCollection from '../tokens/collection'
import FullDateWildcardOperationToken from '../tokens/layer-3/full-date-wildcard-operation-token'
import LongCountWildcardOperationToken from '../tokens/layer-2/long-count-wildcard-operation-token'
import LongCountToken from '../tokens/layer-1/long-count-token'
import CalendarRoundWildcardOperationToken from '../tokens/layer-2/calendar-round-wildcard-operation-token'
import CalendarRoundToken from '../tokens/layer-1/calendar-round-token'
import NumberToken from '../tokens/layer-0/number-token'
import WordToken from '../tokens/layer-0/word-token'
import PeriodToken from '../tokens/layer-0/period-token'
import WildcardToken from '../tokens/layer-0/wildcard-token'
import FullDateToken from '../tokens/layer-3/full-date-token'
import {LineEndToken} from '../tokens/layer-0/line-end-token'

const NT = (n: number) => new NumberToken(n)
const WT = (w: string) => new WordToken(w)
const PT = new PeriodToken()
const WCT = new WildcardToken()
const LET = new LineEndToken()

describe('index parse', () => {
  const cases: [string, TokenCollection][] = [
    [
      '1Ok * * 9.*.10.10.10',
      new TokenCollection([
        FullDateWildcardOperationToken.parse(
          CalendarRoundWildcardOperationToken.parse(
            CalendarRoundToken.parse([NT(1), WT('Ok'), WCT, WCT])
          ),
          LongCountWildcardOperationToken.parse(
            LongCountToken.parse([NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10)])
          )
        ),
        LET
      ])
    ],
    [
      '7 Chikchan 18 Sip 9.10. 2. 5. 5',
      new TokenCollection([
        FullDateToken.parse(
          CalendarRoundToken.parse([NT(7), WT('Chikchan'), NT(18), WT('Sip')]),
          LongCountToken.parse([NT(9), PT, NT(10), PT, NT(2), PT, NT(5), PT, NT(5)])
        ),
        LET
      ])
    ]
  ]

  cases.forEach(([raw, expected]) => {
    it(`${raw} -> ${expected}`, () => {
      const parsed = parse(raw)
      expect(parsed.length).to.eq(expected.length)
      for (let i = 0; i < parsed.length; i++) {
        expect(parsed.index(i).equal(expected.index(i)), `Comparing ${i}`).to.be.true
      }
    })
  })
})
