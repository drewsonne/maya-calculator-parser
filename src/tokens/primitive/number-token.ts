import {IToken, Token} from "../base";

export default class NumberToken extends Token<number> {
  static parse(raw: string): NumberToken {
    const parsed = parseInt(raw, 10)
    if (`${parsed}` !== raw) {
      throw new Error(`Could not parse: '${raw}'`)
    } else if (!isNaN(parsed)) {
      return new NumberToken(parsed)
    } else {
      throw new Error(`Could not parse: '${raw}'`)
    }
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof NumberToken) {
      return otherToken.value === this.value
    }
    return false
  }
}
