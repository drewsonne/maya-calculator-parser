import TokenCollection from "../tokens/collection";
import {IToken} from "../tokens/i-token";
import {
  isCalendarRoundToken,
  isCalendarRoundWildcardOperationToken, isLongCountToken,
  isLongCountWildcardOperationToken
} from "./layer-2-test";
import FullDateWildcardOperationToken from "../tokens/layer-3/full-date-wildcard-operation-token";
import FullDateToken from "../tokens/layer-3/full-date-token";
import BaseParser from "./base-parser";

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

  pop(size: number): T[] {
    const response = this.peek(size)
    this.queue = this.queue.slice(size)
    return response
  }

  toString() {
    return this.queue.join(', ')
  }
}


export default class Layer3Parser extends BaseParser {

  parse(rawTokens: TokenCollection): TokenCollection {
    const tokens: IToken[] = [], queueLength = 2;
    let window: FIFOQueue<IToken> = new FIFOQueue<IToken>(queueLength);
    for (let cursor = 0; cursor < rawTokens.length; cursor += 1) {
      const currentToken = window.push(rawTokens.index(cursor));
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
          window.pop(queueLength)
        } else if (
          isCalendarRoundWildcardOperationToken(latter) ||
          isLongCountWildcardOperationToken(former)
        ) {
          tokens.push(FullDateWildcardOperationToken.parse(latter, former))
          window.pop(queueLength)
        } else if (
          isCalendarRoundToken(former) &&
          isLongCountToken(latter)
        ) {
          tokens.push(FullDateToken.parse(former, latter))
          window.pop(queueLength)
        } else {
          debugger
          tokens.push()
        }
      }
    }

    while (window.length > 0) {
      tokens.push(window.pop(1)[0])
    }

    return new TokenCollection(
      this.appendLineEnd(tokens)
    );
  }
}

