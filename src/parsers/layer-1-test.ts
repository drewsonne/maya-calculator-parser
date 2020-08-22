import SpaceToken from "../tokens/layer-0/space-token";
import NumberToken from "../tokens/layer-0/number-token";
import WordToken from "../tokens/layer-0/word-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import {IToken} from "../tokens/i-token";
import PeriodToken from "../tokens/layer-0/period-token";
import CommentToken from "../tokens/layer-0/comment-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import exp from "constants";
import {isLongCountToken} from "./layer-2-test";

export function isWordToken(t: IToken): t is WordToken {
  return t instanceof WordToken
}

export function isNumberToken(t: IToken): t is NumberToken {
  return t instanceof NumberToken
}

export function isWildcardToken(t: IToken): t is WildcardToken {
  return t instanceof WildcardToken
}

export function isPeriodToken(t: IToken): t is PeriodToken {
  return t instanceof PeriodToken
}

export function isCommentToken(t: IToken): t is CommentToken {
  return t instanceof CommentToken
}

export function isLineEndToken(t: IToken): t is LineEndToken {
  return t instanceof LineEndToken
}

export function isCRCoeff(c: IToken): boolean {
  return isNumberToken(c) || isWildcardToken(c)
}

export function isCRUnit(c: IToken): boolean {
  return isWordToken(c) || isWildcardToken(c)
}

export function isPartialCR(raw: IToken[]): boolean {
  const tokens = raw.filter((t) => !(t instanceof SpaceToken))
  if (tokens.length === 0) {
    return true
  } else if (tokens.length === 1) {
    return isCRCoeff(tokens[0])
  } else if (tokens.length === 2) {
    return isCRCoeff(tokens[0]) && isCRUnit(tokens[1])
  } else if (tokens.length === 3) {
    return isCRCoeff(tokens[0]) && isCRUnit(tokens[1]) && isCRCoeff(tokens[2])
  } else if (tokens.length === 4) {
    return isFullCR(tokens)
  }
  return false
}

export function isPartialLC(raw: IToken[], token: IToken): boolean {
  let result: boolean = true
  const tokens: IToken[] = raw.concat([token])
  for (let i = 0; i < tokens.length; i += 2) {
    const [potentialLC, potentialPeriod] = tokens.slice(i, i + 2)
    const firstTokenCondition = isWildcardToken(potentialLC) || isNumberToken(potentialLC)
    if (firstTokenCondition && potentialPeriod === undefined) {
      continue
    } else if (!(firstTokenCondition && isPeriodToken(potentialPeriod))) {
      result = result && false
    }
  }
  return result
}

export function isFullCR(raw: IToken[]): boolean {
  const tokens = raw.filter((t) => !(t instanceof SpaceToken))
  if (tokens.length === 4) {
    return isCRCoeff(tokens[0]) && isCRUnit(tokens[1]) && isCRCoeff(tokens[2]) && isCRUnit(tokens[3])
  }
  return false
}


