import {IToken, Token} from "../base";

export default class LineEndToken extends Token<string> {
  constructor() {
    super("\n");
  }

  static parse(raw: string): LineEndToken {
    if (raw === "\n") {
      return new LineEndToken()
    }
    throw new Error(`Could not parse: '${raw}'`)

  }

  equal(otherToken: IToken): boolean {
    return (otherToken instanceof LineEndToken)
  }

}
