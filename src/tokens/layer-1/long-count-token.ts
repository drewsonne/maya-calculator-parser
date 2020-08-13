import {Token} from "../base";
import NumberToken from "../layer-0/number-token";
import PeriodToken from "../layer-0/period-token";
import {IToken} from "../i-token";
import WildcardToken from "../layer-0/wildcard-token";
import LongCount from "@drewsonne/maya-dates/lib/lc/long-count";
import {Wildcard} from "@drewsonne/maya-dates/lib/wildcard";
import {isNumberToken, isPeriodToken, isWildcardToken} from "../../parsers/layer-1-test";

export default class LongCountToken extends Token<IToken[]> {
  equal(otherToken: LongCountToken): boolean {
    return `${otherToken}` === `${this}`
  }

  static parse(tokens: IToken[]): LongCountToken {
    return new LongCountToken(
      tokens.filter((t) => isNumberToken(t) || isPeriodToken(t) || isWildcardToken(t))
    );
  }

  toString(): string {
    return this.value.map((t) => `${t}`).join('')
  }

  get longCount(): LongCount {
    const parts: (number | Wildcard)[] = this.value.filter(
      (c) => isNumberToken(c) || isWildcardToken(c)
    ).map(
      (c) => isNumberToken(c) ? c.value : new Wildcard()
    );
    return new LongCount(...parts.reverse())
  }

  isPartial(): boolean {
    return this.value.some((t) => isWildcardToken(t))
  }
}
