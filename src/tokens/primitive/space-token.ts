import {IToken, Token} from "../base";

export default class SpaceToken extends Token<string> {
  constructor() {
    super(' ');
  }

  static parse(raw: string): SpaceToken {
    if (raw === ' ') {
      return new SpaceToken()
    }
    throw new Error(`Could not parse: '${raw}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof SpaceToken) {
      return otherToken.value === this.value
    }
    return false;
  }

}
