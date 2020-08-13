import {Token} from "../base";
import {IToken} from "../i-token";

export default class OperatorToken extends Token<string> {
  static parse(raw: string): OperatorToken {
    if (['+', '-'].includes(raw)) {
      return new OperatorToken(raw)
    }
    throw new Error(`Could not parse: '${raw}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof OperatorToken) {
      return otherToken.value === this.value
    }
    return false
  }

}
