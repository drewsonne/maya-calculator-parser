import TokenCollection from "../tokens/collection";
import NumberToken from "../tokens/layer-0/number-token";
import SpaceToken from "../tokens/layer-0/space-token";
import WordToken from "../tokens/layer-0/word-token";
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import CommentToken from "../tokens/layer-0/comment-token";
import PeriodToken from "../tokens/layer-0/period-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import {IToken} from "../tokens/i-token";
import OperatorToken from "../tokens/layer-0/operator-token";
import CommentStartToken from "../tokens/layer-0/comment-start-token";
import {
  isCommentToken,
  isFullCR,
  isLineEndToken,
  isNumberToken,
  isPartialCR, isPartialLC, isPeriodToken,
  isWildcardToken,
  isWordToken
} from "./layer-1-test";
import BaseParser from "./base-parser";
import {isOperatorToken, isSpaceToken} from "./layer-2-test";

enum Layer1ParserStateValue {
  WAITING,
  PARSING_DATE,
  PARSING_CALENDAR_ROUND,
  PARSING_LONG_COUNT,
  PARSING_COMMENT,
}

class Layer1ParserState {
  private state: Layer1ParserStateValue

  constructor() {
    this.state = Layer1ParserStateValue.WAITING
  }

  reset() {
    this.state = Layer1ParserStateValue.WAITING
  }

  isWaiting(): boolean {
    return this.state === Layer1ParserStateValue.WAITING
  }

  isParsingDate(): boolean {
    return this.state === Layer1ParserStateValue.PARSING_DATE
  }

  isParsingCalendarRound(): boolean {
    return this.state === Layer1ParserStateValue.PARSING_CALENDAR_ROUND
  }

  isParsingLongCount(): boolean {
    return this.state === Layer1ParserStateValue.PARSING_LONG_COUNT
  }

  isParsingComment(): boolean {
    return this.state === Layer1ParserStateValue.PARSING_COMMENT
  }

  startParsingDate() {
    this.state = Layer1ParserStateValue.PARSING_DATE
  }

  startParsingCalendarRound() {
    this.state = Layer1ParserStateValue.PARSING_CALENDAR_ROUND
  }

  startParsingLongCount() {
    this.state = Layer1ParserStateValue.PARSING_LONG_COUNT
  }

  startParsingComment() {
    this.state = Layer1ParserStateValue.PARSING_COMMENT
  }

}


export default class Layer1Parser extends BaseParser {
  private state: Layer1ParserState

  constructor() {
    super();
    this.state = new Layer1ParserState()
  }

  parse(rawTokens: TokenCollection) {
    let tokens: IToken[] = []
    let cache: IToken[] = []
    for (let cursor = 0; cursor < rawTokens.length; cursor += 1) {
      const token = rawTokens.index(cursor);
      if (this.state.isWaiting()) {
        if (
          isNumberToken(token) ||
          isWildcardToken(token)
        ) {
          cache.push(token)
          this.state.startParsingDate()
        } else if (
          isCommentToken(token) ||
          isOperatorToken(token)
        ) {
          tokens.push(token)
        } else if ((token instanceof SpaceToken)) {
          continue
        } else if (
          isCommentToken(token) ||
          isLineEndToken(token)
        ) {
          tokens.push(token)
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingDate()) {
        if (
          isSpaceToken(token) ||
          isWildcardToken(token) ||
          isNumberToken(token)
        ) {
          cache.push(token)
        } else if (isWordToken(token)) {
          cache.push(token)
          this.state.startParsingCalendarRound()
        } else if (isPeriodToken(token)) {
          cache.push(token)
          this.state.startParsingLongCount()
        } else if (isLineEndToken(token)) {
          debugger
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingCalendarRound()) {
        if (isFullCR(cache)) {
          tokens.push(
            CalendarRoundToken.parse(cache)
          )
          cache = []
          this.state.reset()
          cursor -= 1
        } else if (isPartialCR(cache)) {
          cache.push(token)
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingLongCount()) {
        if (isSpaceToken(token)) {
          continue
        } else if (isPartialLC(cache, token)) {
          if (
            isNumberToken(token) ||
            isPeriodToken(token) ||
            isWildcardToken(token)
          ) {
            cache.push(token)
          } else if (
            isLineEndToken(token) ||
            isOperatorToken(token) ||
            isCommentToken(token)
          ) {
            tokens.push(LongCountToken.parse(cache))
            tokens.push(token)
            cache = []
            this.state.reset()
          } else if (isSpaceToken(token)) {
            continue
          } else {
            throw new Error('Layer-1 parser in unexpected state')
          }
        } else {
          tokens.push(LongCountToken.parse(cache))
          cache = []
          cursor -= 1
          this.state.reset()
        }
      } else if (this.state.isParsingComment()) {
        // if (isLineEndToken(layer0Token)) {
        // } else {
        //   cache.push(layer0Token)
        // }
        throw new Error('Layer-1 parser in unexpected state')
      } else {
        throw new Error('Layer-1 parser in unexpected state')
      }
    }
    if (cache.length > 0) {
      if (this.state.isParsingCalendarRound()) {
        if (isFullCR(cache)) {
          tokens.push(
            CalendarRoundToken.parse(cache)
          )
          cache = []
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingLongCount()) {
        tokens.push(
          LongCountToken.parse(cache)
        )
        cache = []
      } else {
        throw new Error('Layer-1 parser in unexpected state')
      }
    }
    return new TokenCollection(
      this.appendLineEnd(tokens)
    );
  }
}
