import {Token} from "../base";
import {IToken} from "../i-token";


export default class LongCountOperationToken extends Token<IToken[]> {
  static parse(operand1: IToken, operator: IToken, operand2: IToken): LongCountOperationToken {
    return new LongCountOperationToken([operand1, operator, operand2])
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof LongCountOperationToken) {
      return this.value[0].equal(otherToken.value[0]) &&
        this.value[1].equal(otherToken.value[1]) &&
        this.value[2].equal(otherToken.value[2])
    }
    return false;
  }
}
