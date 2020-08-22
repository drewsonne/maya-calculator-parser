import {Token} from "../base";
import {IToken} from "../i-token";
import LongCountToken from "../layer-1/long-count-token";
import {isLongCountToken} from "../../parsers/layer-2-test";

export default class LongCountWildcardOperationToken extends Token<LongCountToken> {
  static parse(token: LongCountToken): LongCountWildcardOperationToken {
    if (isLongCountToken(token)) {
      return new LongCountWildcardOperationToken(token)
    }
    throw new Error(`Could not parse: '${token}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof LongCountWildcardOperationToken) {
      return otherToken.value.equal(this.value)
    }
    return false;
  }
}
