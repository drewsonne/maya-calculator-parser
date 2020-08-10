import {IToken} from "./base";

export default class TokenCollection {
  public tokens: IToken[]

  constructor(tokens: IToken[]) {
    this.tokens = tokens
  }

  get length(): number {
    return this.tokens.length
  }

  toString(): string {
    return this.tokens.join(', ')
  }

  index(i: number): IToken {
    return this.tokens[i]
  }
}
