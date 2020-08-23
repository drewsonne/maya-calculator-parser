import {expect} from 'chai'
import 'mocha'
import Layer0Parser from "../parsers/layer-0-parser";
import NumberToken from "../tokens/layer-0/number-token";
import PeriodToken from "../tokens/layer-0/period-token";
import TokenCollection from "../tokens/collection";
import LineEndToken from "../tokens/layer-0/line-end-token";
import SpaceToken from "../tokens/layer-0/space-token";
import WordToken from "../tokens/layer-0/word-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import CommentStartToken from "../tokens/layer-0/comment-start-token";
import CommentToken from "../tokens/layer-0/comment-token";
import OperatorToken from "../tokens/layer-0/operator-token";
import {IToken} from "../tokens/i-token";


const NT = (n: number) => new NumberToken(n)
const WT = (w: string) => new WordToken(w)
const CT = (c: string) => new CommentToken(c)
const OT = (o: string) => new OperatorToken(o)
const PT = new PeriodToken()
const LET = new LineEndToken()
const ST = new SpaceToken()
const WCT = new WildcardToken()
const CST = new CommentStartToken()

describe('layer-0 parser', () => {

  describe('should parse operators', () => {
    const looseOperations: [string, IToken[]][] = [
      [
        '4 Ajaw 8 Kumk\'u - 5 Kimi 4 Mol',
        [
          NT(4), ST, WT('Ajaw'), ST, NT(8), ST, WT('Kumk\'u'),
          ST, OT('-'), ST,
          NT(5), ST, WT('Kimi'), ST, NT(4), ST, WT('Mol')
        ]
      ],
      [
        '9.2.10.10.10 + 10.5.1',
        [
          NT(9), PT, NT(2), PT, NT(10), PT, NT(10), PT, NT(10),
          ST, OT('+'), ST,
          NT(10), PT, NT(5), PT, NT(1)]
      ]
    ]
    const operations: [string, TokenCollection][] = looseOperations.map((row: [string, IToken[]]) => {
      return [row[0], new TokenCollection(row[1])];
    })
    operations.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString)
        expect(tokenised.length).to.eq(expectedTokens.length)
        for (let i = 0; i < tokenised.length; i++) {
          expect(
            tokenised.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    });
  })

  describe('should parse comments', () => {
    const looseFullLines: [string, IToken[]][] = [
      [
        '1Ok * * 9.*.10.10.10 # Hello world, this is a comment',
        [
          NT(1), WT('Ok'), ST, WCT, ST, WCT, ST, NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10),
          ST, CST, ST, CT('Hello world, this is a comment')
        ]
      ],
      [
        "1Ok * * 9.*.10.10.10 # Hello world, this is a comment\n#Another comment",
        [
          NT(1), WT('Ok'), ST, WCT, ST, WCT, ST, NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10),
          ST, CST, ST, CT('Hello world, this is a comment'), LET,
          CST, CT('Another comment')
        ]
      ]

    ]
    const fullLines: [string, TokenCollection][] = looseFullLines.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    fullLines.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString)
        // expect(tokenised.length).to.eq(expectedTokens.length)
        for (let i = 0; i < tokenised.length; i++) {
          expect(
            tokenised.index(i).equal(
              expectedTokens.index(i)
            ), `Comparing ${i}`
          ).to.be.true
        }
      })
    });
  });

  describe('should parse full dates', () => {
    const looseFullDates: [string, IToken[]][] = [
      [
        '1Ok * * 9.*.10.10.10',
        [NT(1), WT('Ok'), ST, WCT, ST, WCT, ST, NT(9), PT, WCT, PT, NT(10), PT, NT(10), PT, NT(10)]
      ]
    ]
    const fullDates: [string, TokenCollection][] = looseFullDates.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    fullDates.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString)
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
  });
  describe('should parse calendar rounds', () => {
    const looseCrs: [string, IToken[]][] = [
      ['4 Ajaw 8 Kumk\'u', [NT(4), ST, WT('Ajaw'), ST, NT(8), ST, WT('Kumk\'u')]],
      ['3 Kawak **', [NT(3), ST, WT('Kawak'), ST, WCT, WCT]],
      ['* Ajaw 8 Kumk\'u', [WCT, ST, WT('Ajaw'), ST, NT(8), ST, WT('Kumk\'u')]],
      ['6 Manik\' 5 Mol', [NT(6), ST, WT('Manik\''), ST, NT(5), ST, WT('Mol')]],
      ['6Manik\' 5Mol', [NT(6), WT('Manik\''), ST, NT(5), WT('Mol')]],
      ['* * 12 Mol', [WCT, ST, WCT, ST, NT(12), ST, WT('Mol')]],
      ['3 Kawak 7 Kumk\'u', [NT(3), ST, WT('Kawak'), ST, NT(7), ST, WT('Kumk\'u')]],
      ['4 Ajaw 8 Kumk\'u', [NT(4), ST, WT('Ajaw'), ST, NT(8), ST, WT('Kumk\'u')]],
      ['** 13 Xul', [WCT, WCT, ST, NT(13), ST, WT('Xul')]],
      ['6 Kimi * * ', [NT(6), ST, WT('Kimi'), ST, WCT, ST, WCT, ST]],
      ['5 Kimi 4 Mol', [NT(5), ST, WT('Kimi'), ST, NT(4), ST, WT('Mol')]],
      ['* Chikchan 3 Mol', [WCT, ST, WT('Chikchan'), ST, NT(3), ST, WT('Mol')]],
    ]
    const crs: [string, TokenCollection][] = looseCrs.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    crs.forEach((pattern) => {
      const [rawString, expectedTokens]: [string, TokenCollection] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString)
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
    const dates: [string, IToken[]][] = [
      ['7.13', [NT(7), PT, NT(13)]],
      ['0.0.0.7.13', [NT(0), PT, NT(0), PT, NT(0), PT, NT(7), PT, NT(13)]],
      ['9.16.19.17.19', [NT(9), PT, NT(16), PT, NT(19), PT, NT(17), PT, NT(19)]],
      ["10.10\n9.9", [NT(10), PT, NT(10), LET, NT(9), PT, NT(9)]],
      [" 8. 7. 6. 5. 4.17. 2. 1", [
        ST, NT(8), PT,
        ST, NT(7), PT,
        ST, NT(6), PT,
        ST, NT(5), PT,
        ST, NT(4), PT,
        NT(17), PT,
        ST, NT(2), PT,
        ST, NT(1),
      ]],
      ['*.*.*.7.13', [WCT, PT, WCT, PT, WCT, PT, NT(7), PT, NT(13)]]
    ]

    const parsed: [string, TokenCollection][] = dates.map((row: [string, IToken[]]) => [row[0], new TokenCollection(row[1])])
    parsed.forEach((pattern) => {
      const [rawString, expectedTokens] = pattern
      it(`${rawString} -> ${expectedTokens}`, () => {
        const tokenised = new Layer0Parser().parse(rawString)
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
