import {expect} from 'chai'
import 'mocha'
import NumberToken from "../tokens/layer-0/number-token";
import WordToken from "../tokens/layer-0/word-token";
import CommentToken from "../tokens/layer-0/comment-token";
import OperatorToken from "../tokens/layer-0/operator-token";
import PeriodToken from "../tokens/layer-0/period-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import TokenCollection from "../tokens/collection";
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import {IToken} from "../tokens/i-token";
import Layer0Parser from "../parsers/layer-0-parser";
import LongCountWildcardOperationToken from "../tokens/layer-2/long-count-wildcard-operation-token";
import CalendarRoundWildcardOperationToken from "../tokens/layer-2/calendar-round-wildcard-operation-token";
import CalendarRoundOperationToken from "../tokens/layer-2/calendar-round-operation-token";
import LongCountOperationToken from "../tokens/layer-2/long-count-operation-token";
import {LineEndToken} from "../tokens/layer-0/line-end-token";

const NT = (n: number) => new NumberToken(n)
const WT = (w: string) => new WordToken(w)
const CT = (c: string) => new CommentToken(c)
const OT = (o: string) => new OperatorToken(o)
const PT = new PeriodToken()
const WCT = new WildcardToken()
const LET = new LineEndToken()


describe('layer-2 parser', () => {

  describe('should parse operators', () => {
    const looseOperations: [string, IToken[]][] = [
      [
        '4 Ajaw 8 Kumk\'u - 5 Kimi 4 Mol',
        [
          CalendarRoundOperationToken.parse(
            CalendarRoundToken.parse([NT(4), WT('Ajaw'), NT(8), WT('Kumk\'u')]),
            OT('-'),
            CalendarRoundToken.parse([NT(5), WT('Kimi'), NT(4), WT('Mol')]),
          ),
          LET
        ]
      ],
      [
        '9.2.10.10.10 + 10.5.1',
        [
          LongCountOperationToken.parse(
            LongCountToken.parse([NT(9), PT, NT(2), PT, NT(10), PT, NT(10), PT, NT(10)]),
            OT('+'),
            LongCountToken.parse([NT(10), PT, NT(5), PT, NT(1)])
          ),
          LET
        ]
      ],
      [
        '1Ok * *',
        [
          CalendarRoundWildcardOperationToken.parse(
            CalendarRoundToken.parse([NT(1), WT('Ok'), WCT, WCT]),
          ),
          LET
        ]
      ],
      [
        '9.*.10.10.10',
        [
          LongCountWildcardOperationToken.parse(
            LongCountToken.parse([NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10)]),
          ),
          LET
        ]
      ]
    ]
    const operations: [string, TokenCollection][] = looseOperations.map((row: [string, IToken[]]) => {
      return [row[0], new TokenCollection(row[1])];
    })
    operations.forEach((pattern) => {
      const [rawText, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawText} -> ${expectedTokens}`, () => {

        const layer1Tokens = new Layer0Parser().parse(rawText).processLayer1().processLayer2()

        expect(layer1Tokens.length).to.eq(expectedTokens.length)
        for (let i = 0; i < layer1Tokens.length; i++) {
          expect(
            layer1Tokens.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    });
  })

  describe('should parse calendar rounds', () => {
    const looseCrs: [string, IToken[]][] = [
      [
        '4 Ajaw 8 Kumk\'u',
        [
          CalendarRoundToken.parse([NT(4), WT('Ajaw'), NT(8), WT('Kumk\'u')]),
          LET
        ]
      ],
      [
        "4 Ajaw 8 Kumk\'u\n3 Kawak **",
        [
          CalendarRoundToken.parse([NT(4), WT('Ajaw'), NT(8), WT('Kumk\'u')]),
          LET,
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([NT(3), WT('Kawak'), WCT, WCT])),
          LET
        ]
      ],
      [
        '3 Kawak **',
        [
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([NT(3), WT('Kawak'), WCT, WCT])),
          LET
        ]
      ],
      [
        '* Ajaw 8 Kumk\'u',
        [
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([WCT, WT('Ajaw'), NT(8), WT('Kumk\'u')])),
          LET
        ]
      ],
      [
        '6 Manik\' 5 Mol',
        [
          CalendarRoundToken.parse([NT(6), WT('Manik\''), NT(5), WT('Mol')]),
          LET
        ]
      ],
      [
        '* * 12 Mol',
        [
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([WCT, WCT, NT(12), WT('Mol')])),
          LET
        ]
      ],
      [
        '3 Kawak 7 Kumk\'u',
        [
          CalendarRoundToken.parse([NT(3), WT('Kawak'), NT(7), WT('Kumk\'u')]),
          LET
        ]
      ],
      [
        '4 Ajaw 8 Kumk\'u',
        [
          CalendarRoundToken.parse([NT(4), WT('Ajaw'), NT(8), WT('Kumk\'u')]),
          LET
        ]
      ],
      [
        '** 13 Xul',
        [
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([WCT, WCT, NT(13), WT('Xul')])),
          LET
        ]
      ],
      [
        '6 Kimi * * ',
        [
          CalendarRoundWildcardOperationToken.parse(CalendarRoundToken.parse([NT(6), WT('Kimi'), WCT, WCT])),
          LET
        ]
      ],
      [
        '5 Kimi 4 Mol',
        [
          CalendarRoundToken.parse([NT(5), WT('Kimi'), NT(4), WT('Mol')]),
          LET
        ]
      ],
      [
        '* Chikchan 3 Mol #Hello, world',
        [
          CalendarRoundWildcardOperationToken.parse(
            CalendarRoundToken.parse([WCT, WT('Chikchan'), NT(3), WT('Mol')])
          ),
          CT('Hello, world'),
          LET
        ]
      ],
    ]
    const crs: [string, TokenCollection][] = looseCrs.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    crs.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {

        const tokenised = new Layer0Parser().parse(rawString).processLayer1().processLayer2()

        expect(tokenised.length).to.eq(expectedTokens.length)
        for (let i = 0; i < tokenised.length; i++) {
          expect(
            tokenised.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    })
  })

  describe('should parse long counts', () => {
    const looseLongCounts: [string, IToken[]][] = [
      [
        '7.13',
        [LongCountToken.parse([NT(7), PT, NT(13)]), LET]
      ],
      [
        '0.0.0.7.13',
        [LongCountToken.parse([NT(0), PT, NT(0), PT, NT(0), PT, NT(7), PT, NT(13)]), LET]
      ],
      [
        '9.16.19.17.19',
        [LongCountToken.parse([NT(9), PT, NT(16), PT, NT(19), PT, NT(17), PT, NT(19)]), LET]
      ],
      [
        "10.10\n9.9",
        [LongCountToken.parse([NT(10), PT, NT(10)]), LongCountToken.parse([NT(9), PT, NT(9)]), LET]
      ],
      [
        ' 8. 7. 6. 5. 4.17. 2. 1',
        [
          LongCountToken.parse([
            NT(8), PT,
            NT(7), PT,
            NT(6), PT,
            NT(5), PT,
            NT(4), PT,
            NT(17), PT,
            NT(2), PT,
            NT(1),
          ]),
          LET
        ]
      ]
    ]

    const longcounts: [string, TokenCollection][] = looseLongCounts.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    longcounts.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString).processLayer1()
        expect(tokenised.length).to.eq(expectedTokens.length)
        for (let i = 0; i < tokenised.length; i++) {
          expect(
            tokenised.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    })
  })
})

