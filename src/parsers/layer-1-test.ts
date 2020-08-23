import SpaceToken from "../tokens/layer-0/space-token";
import NumberToken from "../tokens/layer-0/number-token";
import WordToken from "../tokens/layer-0/word-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import {IToken} from "../tokens/i-token";
import PeriodToken from "../tokens/layer-0/period-token";
import CommentToken from "../tokens/layer-0/comment-token";

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

export function isFullCR(raw: IToken[]): boolean {
  const tokens = raw.filter((t) => !(t instanceof SpaceToken))
  if (tokens.length === 4) {
    return isCRCoeff(tokens[0]) && isCRUnit(tokens[1]) && isCRCoeff(tokens[2]) && isCRUnit(tokens[3])
  }
  return false
}


