import {IToken} from "../i-token";
import {Token} from "../base";
import {isCalendarRoundWildcardOperationToken, isLongCountWildcardOperationToken} from "../../parsers/layer-2-test";

export default class FullDateWildcardOperationToken extends Token<[IToken, IToken]> {

  static parse(crWildcard: IToken, lcWildcard: IToken): FullDateWildcardOperationToken {
    if (isCalendarRoundWildcardOperationToken(crWildcard) || isLongCountWildcardOperationToken(lcWildcard)) {
      return new FullDateWildcardOperationToken([crWildcard, lcWildcard])
    }
    throw new Error(`Could not parse: '${crWildcard}', '${lcWildcard}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof FullDateWildcardOperationToken) {
      return this.value[0].equal(otherToken.value[0]) &&
        this.value[1].equal(otherToken.value[1])
    }
    return false;
  }
}
