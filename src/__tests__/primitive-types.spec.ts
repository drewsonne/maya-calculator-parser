import {expect} from 'chai'
import 'mocha'
import NumberToken from "../tokens/layer-0/number-token";
import {Token} from "../tokens/base";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import WordToken from "../tokens/layer-0/word-token";
import PeriodToken from "../tokens/layer-0/period-token";
import SpaceToken from "../tokens/layer-0/space-token";
import CommentStartToken from "../tokens/layer-0/comment-start-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import {IToken} from "../tokens/i-token";


describe('layer-0 number parser', () => {

  describe('should parse numbers', () => {
    const dates: [string, NumberToken][] = [
      ['713', new NumberToken(713)],
      ['13', new NumberToken(13)],
      ['10', new NumberToken(10)],
      ['19', new NumberToken(19)]
    ];
    dates.forEach((number: [string, NumberToken]) => {
      const [raw, expected] = number
      it(`'${raw}' -> ${expected}`, () => {
        const actual = NumberToken.parse(raw)
        expect(actual.equal(expected)).to.be.true
        expect(`${actual}`).to.equal(`${expected}`)
      });
    })
  });

  describe('should fail parsing non-numbers', () => {
    const non_numbers: any[] = [null, undefined, '10.6', {}, []]
    type ParserType = (typeof NumberToken | typeof PeriodToken | typeof WordToken | typeof WildcardToken | typeof SpaceToken | typeof CommentStartToken | typeof LineEndToken)
    const parsers: ParserType[] = [NumberToken, PeriodToken, WordToken, WildcardToken]
    non_numbers.forEach((non_number) => {
      parsers.forEach((parser) => {
        it(`${parser.name}: ${non_number}`, () => {
          expect(() => parser.parse(non_number)).to.throw(`Could not parse: '${non_number}'`)
        });
      });
    });
  });
});
