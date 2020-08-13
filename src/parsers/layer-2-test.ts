import {IToken} from "../tokens/i-token";
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import OperatorToken from "../tokens/layer-0/operator-token";
import CalendarRoundWildcardOperationToken from "../tokens/layer-2/calendar-round-wildcard-operation-token";
import LongCountWildcardOperationToken from "../tokens/layer-2/long-count-wildcard-operation-token";


export function isPartialOperation(cache: IToken[], layer1Token: IToken): boolean {
  const full = cache.concat([layer1Token])
  if (full.length === 1) {
    return isToken(full[0])
  }
  if (full.length === 2) {
    return isToken(full[0]) && isOperatorToken(full[1])
  }
  return false;
}

export function isFullOperation(cache: IToken[], layer1Token: IToken) {
  const full = cache.concat([layer1Token])
  if (full.length === 3) {
    return isToken(full[0]) && isOperatorToken(full[1]) && isToken(full[2])
  }
  return false;
}

export function isLongCountOperation(tokens: [IToken, IToken, IToken]): boolean {
  return isLongCountToken(tokens[0]) && isOperatorToken(tokens[1]) && isLongCountToken(tokens[2])
}

export function isCalendarRoundOperation(tokens: [IToken, IToken, IToken]): boolean {
  return isCalendarRoundToken(tokens[0]) && isOperatorToken(tokens[1]) && isCalendarRoundToken(tokens[2])
}

export function isLongCountToken(t: IToken): t is LongCountToken {
  return (t instanceof LongCountToken)
}

export function isCalendarRoundToken(t: IToken): t is CalendarRoundToken {
  return (t instanceof CalendarRoundToken)
}

export function isCalendarRoundWildcardOperationToken(t: IToken): t is CalendarRoundWildcardOperationToken {
  return (t instanceof CalendarRoundWildcardOperationToken)
}

export function isLongCountWildcardOperationToken(t: IToken): t is LongCountWildcardOperationToken {
  return t instanceof LongCountWildcardOperationToken
}

export function isToken(t: IToken): boolean {
  return isCalendarRoundToken(t) || isLongCountToken(t)
}


export function isOperatorToken(t: IToken): t is OperatorToken {
  return (t instanceof OperatorToken)
}
