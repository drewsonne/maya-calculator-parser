import {Token} from "../base";
import {IToken} from "../i-token";

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
