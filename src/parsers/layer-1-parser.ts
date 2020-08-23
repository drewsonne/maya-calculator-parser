import TokenCollection from "../tokens/collection";
import NumberToken from "../tokens/layer-0/number-token";
import SpaceToken from "../tokens/layer-0/space-token";
import WordToken from "../tokens/layer-0/word-token";
import CalendarRoundToken from "../tokens/layer-1/calendar-round-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import {Comment} from "typedoc/dist/lib/models";
import CommentToken from "../tokens/layer-0/comment-token";
import PeriodToken from "../tokens/layer-0/period-token";
import LongCountToken from "../tokens/layer-1/long-count-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import {IToken} from "../tokens/i-token";
import OperatorToken from "../tokens/layer-0/operator-token";
import CommentStartToken from "../tokens/layer-0/comment-start-token";
import {isFullCR, isPartialCR} from "./layer-1-test";

enum Layer1ParserStateValue {
  WAITING,
  PARSING_DATE,
  PARSING_CALENDAR_ROUND,
  PARSING_LONG_COUNT,
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

  startParsingDate() {
    this.state = Layer1ParserStateValue.PARSING_DATE
  }

  startParsingCalendarRound() {
    this.state = Layer1ParserStateValue.PARSING_CALENDAR_ROUND
  }

  startParsingLongCount() {
    this.state = Layer1ParserStateValue.PARSING_LONG_COUNT
  }
}


export default class Layer1Parser {
  private state: Layer1ParserState

  constructor() {
    this.state = new Layer1ParserState()
  }

  parse(layer0Tokens: TokenCollection) {
    let tokens: IToken[] = []
    let cache: IToken[] = []
    for (let cursor = 0; cursor < layer0Tokens.length; cursor += 1) {
      const layer0Token = layer0Tokens.index(cursor);
      if (this.state.isWaiting()) {
        if ((layer0Token instanceof NumberToken) || (layer0Token instanceof WildcardToken)) {
          cache.push(layer0Token)
          this.state.startParsingDate()
        } else if (
          (layer0Token instanceof CommentToken) ||
          (layer0Token instanceof OperatorToken)
        ) {
          tokens.push(layer0Token)
        } else if ((layer0Token instanceof SpaceToken) || (layer0Token instanceof CommentStartToken)) {
          continue
        } else if (layer0Token instanceof CommentToken) {
          tokens.push(layer0Token)
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingDate()) {
        if (layer0Token instanceof SpaceToken) {
          cache.push(layer0Token)
        } else if (layer0Token instanceof WordToken) {
          cache.push(layer0Token)
          this.state.startParsingCalendarRound()
        } else if (layer0Token instanceof WildcardToken) {
          cache.push(layer0Token)
        } else if (layer0Token instanceof NumberToken) {
          cache.push(layer0Token)
        } else if (layer0Token instanceof PeriodToken) {
          cache.push(layer0Token)
          this.state.startParsingLongCount()
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
        } else if (isPartialCR(cache)) {
          cache.push(layer0Token)
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
      } else if (this.state.isParsingLongCount()) {
        if (
          (layer0Token instanceof NumberToken) ||
          (layer0Token instanceof PeriodToken) ||
          (layer0Token instanceof WildcardToken)
        ) {
          cache.push(layer0Token)
        } else if ((layer0Token instanceof LineEndToken)) {
          tokens.push(LongCountToken.parse(cache))
          cache = []
        } else if (layer0Token instanceof SpaceToken) {
          continue
        } else if (layer0Token instanceof OperatorToken) {
          tokens.push(LongCountToken.parse(cache))
          tokens.push(layer0Token)
          cache = []
          this.state.reset()
        } else {
          throw new Error('Layer-1 parser in unexpected state')
        }
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
    return new TokenCollection(tokens);
  }
}
