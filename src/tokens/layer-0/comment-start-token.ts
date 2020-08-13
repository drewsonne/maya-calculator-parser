import {Token} from "../base";
import {IToken} from "../i-token";

export default class CommentStartToken extends Token<string> {
  constructor() {
    super('#');
  }

  static parse(raw: string): CommentStartToken {
    if (raw === '#') {
      return new CommentStartToken()
    }
    throw new Error(`Could not parse: '${raw}'`)

  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof CommentStartToken) {
      return otherToken.value === this.value
    }
    return false
  }

}
