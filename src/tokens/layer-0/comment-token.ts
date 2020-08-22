import {Token} from "../base";
import {IToken} from "../i-token";

export default class CommentToken extends Token<string> {
  equal(otherToken: IToken): boolean {
    if (otherToken instanceof CommentToken) {
      return otherToken.value === this.value
    }
    return false;
  }

  static parse(raw: string): CommentToken {
    const wordPattern = /[\n]+/;
    if (!raw.match(wordPattern)) {
      return new CommentToken(raw)
    }
    throw new Error(`Could not parse: '${raw}'`)
  }
}
