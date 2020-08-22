import TokenCollection from "../tokens/collection";
import {IToken} from "../tokens/i-token";
import {
  isCalendarRoundOperation, isCalendarRoundToken,
  isFullOperation, isLongCountOperation,
  isLongCountToken, isOperatorToken,
  isPartialOperation
} from "./layer-2-test";
import CalendarRoundOperationToken from "../tokens/layer-2/calendar-round-operation-token";
import LongCountOperationToken from "../tokens/layer-2/long-count-operation-token";
import CalendarRoundWildcardOperationToken from "../tokens/layer-2/calendar-round-wildcard-operation-token";
import LongCountWildcardOperationToken from "../tokens/layer-2/long-count-wildcard-operation-token";
import {isCommentToken, isLineEndToken} from "./layer-1-test";
import BaseParser from "./base-parser";
import ParserError from "./exeption";


export default class Layer2Parser extends BaseParser {

  parse(layer1Tokens: TokenCollection): TokenCollection {
    let tokens: IToken[] = []
    let cache: IToken[] = []
    for (let cursor = 0; cursor < layer1Tokens.length; cursor += 1) {
      const token = layer1Tokens.index(cursor);
      if (isLongCountToken(token)) {
        if (token.isPartial()) {
          tokens.push(LongCountWildcardOperationToken.parse(token))
        } else if (isOperatorToken(cache[0])) {
          if (tokens.length > 0) {
            const lastToken = tokens.pop()
            if (lastToken !== undefined) {
              const operator = cache.pop()
              if (operator !== undefined) {
                if (isLongCountToken(lastToken)) {
                  tokens.push(LongCountOperationToken.parse(lastToken, operator, token))
                } else {
                  tokens.push(lastToken)
                }
              } else {
                throw new ParserError(2)
              }
            } else {
              throw new ParserError(2)
            }
          } else {
            throw new ParserError(2)
          }
        } else {
          tokens.push(token)
        }
      } else if (isCalendarRoundToken(token)) {
        if (token.isPartial()) {
          tokens.push(CalendarRoundWildcardOperationToken.parse(token))
        } else if (isOperatorToken(cache[0])) {
          if (tokens.length > 0) {
            const lastToken = tokens.pop()
            if (lastToken !== undefined) {
              const operator = cache.pop()
              if (operator !== undefined) {
                if (isCalendarRoundToken(lastToken)) {
                  tokens.push(CalendarRoundOperationToken.parse(lastToken, operator, token))
                } else {
                  tokens.push(lastToken)
                }
              } else {
                throw new ParserError(2)
              }
            } else {
              throw new ParserError(2)
            }
          } else {
            throw new ParserError(2)
          }
        } else {
          tokens.push(token)
        }
      } else if (isPartialOperation(cache, token)) {
        cache.push(token)
      } else if (isFullOperation(cache, token)) {
        cache.push(token)
        if (isLongCountOperation([cache[0], cache[1], cache[2]])) {
          tokens.push(LongCountOperationToken.parse(cache[0], cache[1], cache[2]))
          cursor += 1
        } else if (isCalendarRoundOperation([cache[0], cache[1], cache[2]])) {
          tokens.push(CalendarRoundOperationToken.parse(cache[0], cache[1], cache[2]))
          cursor += 1
        } else {
          throw new ParserError(2)
        }
        cache = []
      } else if (isOperatorToken(token)) {
        const previous = tokens.pop()
        if (previous !== undefined) {
          const next = layer1Tokens.index(cursor + 1)
          if (isLongCountToken(previous) && isLongCountToken(next)) {
            tokens.push(LongCountOperationToken.parse(previous, token, next))
            cursor += 1
          } else if (isCalendarRoundToken(previous) && isCalendarRoundToken(next)) {
            tokens.push(CalendarRoundOperationToken.parse(previous, token, next))
            cursor += 1
          } else {
            throw new ParserError(2)
          }
        } else {
          throw new ParserError(2)
        }
      } else if (
        isCommentToken(token) ||
        isLineEndToken(token)
      ) {
        tokens.push(token)
      } else {
        throw new ParserError(2)
      }
    }
    return new TokenCollection(
      this.appendLineEnd(tokens)
    );
  }
}
