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
import {isCommentToken} from "./layer-1-test";
import {isLineEndToken} from "../tokens/layer-0/line-end-token";


export default class Layer2Parser {

  parse(layer1Tokens: TokenCollection): TokenCollection {
    let tokens: IToken[] = []
    let cache: IToken[] = []
    for (let cursor = 0; cursor < layer1Tokens.length; cursor += 1) {
      const layer1Token = layer1Tokens.index(cursor);
      if (isLongCountToken(layer1Token)) {
        if (layer1Token.isPartial()) {
          tokens.push(LongCountWildcardOperationToken.parse(layer1Token))
        } else if (isOperatorToken(cache[0])) {
          if (tokens.length > 0) {
            const lastToken = tokens.pop()
            if (lastToken !== undefined) {
              const operator = cache.pop()
              if (operator !== undefined) {
                if (isLongCountToken(lastToken)) {
                  tokens.push(LongCountOperationToken.parse(lastToken, operator, layer1Token))
                } else {
                  tokens.push(lastToken)
                }
              } else {
                debugger
              }
            } else {
              debugger
            }
          } else {
            debugger
          }
        } else {
          tokens.push(layer1Token)
        }
      } else if (isCalendarRoundToken(layer1Token)) {
        if (layer1Token.isPartial()) {
          tokens.push(CalendarRoundWildcardOperationToken.parse(layer1Token))
        } else if (isOperatorToken(cache[0])) {
          if (tokens.length > 0) {
            const lastToken = tokens.pop()
            if (lastToken !== undefined) {
              const operator = cache.pop()
              if (operator !== undefined) {
                if (isCalendarRoundToken(lastToken)) {
                  tokens.push(CalendarRoundOperationToken.parse(lastToken, operator, layer1Token))
                } else {
                  tokens.push(lastToken)
                }
              } else {
                debugger
              }
            } else {
              debugger
            }
          } else {
            debugger
          }
        } else {
          tokens.push(layer1Token)
        }
      } else if (isPartialOperation(cache, layer1Token)) {
        cache.push(layer1Token)
      } else if (isFullOperation(cache, layer1Token)) {
        cache.push(layer1Token)
        if (isLongCountOperation([cache[0], cache[1], cache[2]])) {
          tokens.push(LongCountOperationToken.parse(cache[0], cache[1], cache[2]))
        } else if (isCalendarRoundOperation([cache[0], cache[1], cache[2]])) {
          tokens.push(CalendarRoundOperationToken.parse(cache[0], cache[1], cache[2]))
        } else {
          debugger
        }
        cache = []
      } else if (isOperatorToken(layer1Token)) {
        cache.push(layer1Token)
      } else if (isCommentToken(layer1Token)) {
        tokens.push(layer1Token)
      } else if (isLineEndToken(layer1Token)) {
        tokens.push(layer1Token)
      } else {
        throw new Error('Layer-2 parser in unexpected state')
      }
    }
    if (cache.length > 0) {
      debugger
    }
    return new TokenCollection(tokens).normaliseLineEndToken()
  }
}
