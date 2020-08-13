import TokenCollection from "../tokens/collection";
import {IToken} from "../tokens/i-token";
import {
  isCalendarRoundToken,
  isCalendarRoundWildcardOperationToken, isLongCountToken,
  isLongCountWildcardOperationToken
} from "./layer-2-test";
import FullDateWildcardOperationToken from "../tokens/layer-3/full-date-wildcard-operation-token";
import FullDateToken from "../tokens/layer-3/full-date-token";

class FIFOQueue<T> {
  private readonly size: number;
  private queue: T[];

  constructor(length: number) {
    this.size = length
    this.queue = []
  }

  push(item: T): T | undefined {
    this.queue.push(item)
    if (this.queue.length <= this.size) {
      return undefined
    } else {
      return this.queue.shift()
    }
  }

  get length(): number {
    return this.queue.length
  }

  isFull(): boolean {
    return this.size === this.length
  }

  peek(size: number): T[] {
    return this.queue.slice(0, size)
  }

  reset() {
    this.queue = []
  }
}


export default class Layer3Parser {

  parse(layer2Tokens: TokenCollection): TokenCollection {
    const tokens: IToken[] = []
    let window: FIFOQueue<IToken> = new FIFOQueue<IToken>(2);
    for (let cursor = 0; cursor < layer2Tokens.length; cursor += 1) {
      const currentToken = window.push(layer2Tokens.index(cursor));
      if (window.isFull()) {
        if (currentToken !== undefined) {
          tokens.push(currentToken)
        }
        const [former, latter]: IToken[] = window.peek(2)
        if (
          isCalendarRoundWildcardOperationToken(former) ||
          isLongCountWildcardOperationToken(latter)
        ) {
          tokens.push(FullDateWildcardOperationToken.parse(former, latter))
        } else if (
          isCalendarRoundToken(former) &&
          isLongCountToken(latter)
        ) {
          tokens.push(FullDateToken.parse(former, latter))
        } else {
          debugger
        }
      }
    }
    return new TokenCollection(tokens)
  }
}

