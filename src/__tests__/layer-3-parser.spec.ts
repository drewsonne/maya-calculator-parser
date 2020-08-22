import 'mocha'
import {expect} from 'chai'
import {IToken} from "../tokens/i-token";
import TokenCollection from "../tokens/collection";
import Layer0Parser from "../parsers/layer-0-parser";
import FullDateWildcardOperationToken from "../tokens/layer-3/full-date-wildcard-operation-token";
import LongCountWildcardOperationToken from "../tokens/layer-2/long-count-wildcard-operation-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import CalendarRoundWildcardOperationToken from "../tokens/layer-2/calendar-round-wildcard-operation-token";
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import NumberToken from "../tokens/layer-0/number-token";
import WordToken from "../tokens/layer-0/word-token";
import PeriodToken from "../tokens/layer-0/period-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import FullDateToken from "../tokens/layer-3/full-date-token";
import LineEndToken from "../tokens/layer-0/line-end-token";

const NT = (n: number) => new NumberToken(n)
const WT = (w: string) => new WordToken(w)
const PT = new PeriodToken()
const WCT = new WildcardToken()
const LET = new LineEndToken()


describe('layer-3 parser', () => {
  describe('should parse operators', () => {
    const looseFullDates: [string, IToken[]][] = [
      [
        '1Ok * * 9.*.10.10.10',
        [
          FullDateWildcardOperationToken.parse(
            CalendarRoundWildcardOperationToken.parse(
              CalendarRoundToken.parse([NT(1), WT('Ok'), WCT, WCT]),
            ),
            LongCountWildcardOperationToken.parse(
              LongCountToken.parse([NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10)]),
            )
          ),
          LET
        ]
      ],
      [
        '1Ok * * 9.4.10.10.10',
        [
          FullDateWildcardOperationToken.parse(
            CalendarRoundWildcardOperationToken.parse(
              CalendarRoundToken.parse([NT(1), WT('Ok'), WCT, WCT]),
            ),
            LongCountToken.parse([NT(9), PT, NT(4), PT, NT(10), PT, NT(10), PT, NT(10)]),
          ),
          LET
        ]
      ],
      [
        '1Ok 18 Kumk\'u 9.*.10.10.10',
        [
          FullDateWildcardOperationToken.parse(
            CalendarRoundToken.parse([NT(1), WT('Ok'), NT(18), WT('Kumk\'u')]),
            LongCountWildcardOperationToken.parse(
              LongCountToken.parse([NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10)]),
            )
          ),
          LET
        ]
      ],
      [
        '7 Chikchan 18 Sip 9.10. 2. 5. 5',
        [
          FullDateToken.parse(
            CalendarRoundToken.parse([NT(7), WT('Chikchan'), NT(18), WT('Sip')]),
            LongCountToken.parse([NT(9), PT, NT(10), PT, NT(2), PT, NT(5), PT, NT(5)])
          ),
          LET
        ]
      ],
      [
        '9.10.*.5.* * Chikchan *Sip',
        [
          FullDateWildcardOperationToken.parse(
            CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([
              WCT, WT('Chikchan'), WCT, WT('Sip')
            ])),
            LongCountWildcardOperationToken.parse(LongCountToken.parse([
              NT(9), PT, NT(10), PT, WCT, PT, NT(5), PT, WCT
            ]))
          ), LET
        ]
      ]
    ]
    const operations: [string, TokenCollection][] = looseFullDates.map((row: [string, IToken[]]) => {
      return [row[0], new TokenCollection(row[1])];
    });
    operations.forEach((pattern) => {
      const [rawText, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawText} -> ${expectedTokens}`, () => {

        const layer3Tokens = new Layer0Parser().parse(rawText).processLayer1().processLayer2().processLayer3()

        expect(`${layer3Tokens}`).to.be.eq(`${expectedTokens}`)
        expect(layer3Tokens.length).to.eq(expectedTokens.length)
        for (let i = 0; i < layer3Tokens.length; i++) {
          expect(
            layer3Tokens.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    });
  })
})
