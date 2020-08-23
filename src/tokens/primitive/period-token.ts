import {IToken, Token} from "../base";

export default class PeriodToken extends Token<string> {
  constructor() {
    super('.');
  }

  static parse(raw: string): PeriodToken {
    if (raw === '.') {
      return new PeriodToken()
    }
    throw new Error(`Could not parse: '${raw}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof PeriodToken) {
      return otherToken.value === this.value
    }
    return false
  }
}
