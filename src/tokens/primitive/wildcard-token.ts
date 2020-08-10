import {IToken, Token} from "../base";

export default class WildcardToken extends Token<string> {
  constructor() {
    super('*');
  }

  static parse(raw: string): WildcardToken {
    if (raw === '*') {
      return new WildcardToken()
    }
    throw new Error(`Could not parse: '${raw}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof WildcardToken) {
      return otherToken.value === this.value
    }
    return false
  }
}
