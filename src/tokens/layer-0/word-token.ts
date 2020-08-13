import {Token} from "../base";
import {IToken} from "../i-token";

export default class WordToken extends Token<string> {
  static parse(raw: string): WordToken {
    const wordPattern = /[^'a-zA-Z]+/;
    if (typeof raw === 'string') {
      if (!raw.match(wordPattern)) {
        return new WordToken(raw)
      }
    }
    throw new Error(`Could not parse: '${raw}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof WordToken) {
      return otherToken.value === this.value
    }
    return false;
  }

}
