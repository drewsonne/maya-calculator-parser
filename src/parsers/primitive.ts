import {IToken} from "../tokens/base";
import PrimitiveTest from "./simple-test";
import NumberToken from "../tokens/primitive/number-token";
import PeriodToken from "../tokens/primitive/period-token";
import LineEndToken from "../tokens/primitive/line-end-token";
import SpaceToken from "../tokens/primitive/space-token";
import WordToken from "../tokens/primitive/word-token";
import WildcardToken from "../tokens/primitive/wildcard-token";
import TokenCollection from "../tokens/collection";
import CommentStartToken from "../tokens/primitive/comment-start-token";
import CommentToken from "../tokens/primitive/comment-token";
import OperatorToken from "../tokens/primitive/operator-token";

enum PrimitiveParserStateValue {
  WAITING,
  PARSING_NUMBER,
  PARSING_WORD,
  PARSING_COMMENT_START,
  PARSING_COMMENT_BODY,
}

class PrimitiveParserState {
  private state: PrimitiveParserStateValue

  constructor() {
    this.state = PrimitiveParserStateValue.WAITING
  }

  isWaiting(): boolean {
    return this.state === PrimitiveParserStateValue.WAITING
  }

  isParsingNumber(): boolean {
    return this.state === PrimitiveParserStateValue.PARSING_NUMBER
  }

  isParsingWord(): boolean {
    return this.state === PrimitiveParserStateValue.PARSING_WORD
  }

  isParsingCommentStart(): boolean {
    return this.state === PrimitiveParserStateValue.PARSING_COMMENT_START
  }

  isParsingCommentBody(): boolean {
    return this.state === PrimitiveParserStateValue.PARSING_COMMENT_BODY
  }

  reset() {
    this.state = PrimitiveParserStateValue.WAITING
  }

  startParsingNumber() {
    this.state = PrimitiveParserStateValue.PARSING_NUMBER
  }

  startParsingWord() {
    this.state = PrimitiveParserStateValue.PARSING_WORD
  }

  startParsingComment() {
    this.state = PrimitiveParserStateValue.PARSING_COMMENT_START
  }

  startParsingCommentBody() {
    this.state = PrimitiveParserStateValue.PARSING_COMMENT_BODY
  }
}

export default class PrimitiveParser {
  private state: PrimitiveParserState

  constructor() {
    this.state = new PrimitiveParserState()
  }

  parse(rawText: string): TokenCollection {
    let tokens: IToken[] = []
    let cache: string[] = []
    for (let cursor = 0; cursor < rawText.length; cursor += 1) {
      const cell = rawText[cursor];
      if (this.state.isWaiting()) {
        if (PrimitiveTest.isLetter(cell)) {
          this.state.startParsingWord()
          cache.push(cell)
        } else if (PrimitiveTest.isNumber(cell)) {
          this.state.startParsingNumber()
          cache.push(cell)
        } else if (PrimitiveTest.isPeriod(cell)) {
          tokens.push(PeriodToken.parse(cell))
        } else if (PrimitiveTest.isSpace(cell)) {
          tokens.push(SpaceToken.parse(cell))
        } else if (PrimitiveTest.isWildcard(cell)) {
          tokens.push(WildcardToken.parse(cell))
        } else if (PrimitiveTest.isCommentStart(cell)) {
          tokens.push(CommentStartToken.parse(cell))
          this.state.startParsingComment()
        } else if (PrimitiveTest.isOperator(cell)) {
          tokens.push(OperatorToken.parse(cell))
          this.state.reset()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else if (this.state.isParsingNumber()) {
        if (PrimitiveTest.isLetter(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          cache = [cell]
          this.state.startParsingWord()
        } else if (PrimitiveTest.isNumber(cell)) {
          cache.push(cell)
        } else if (PrimitiveTest.isPeriod(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(PeriodToken.parse(cell))
          cache = []
          this.state.reset()
        } else if (PrimitiveTest.isCarriageReturn(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(LineEndToken.parse(cell))
          cache = []
          this.state.reset()
        } else if (PrimitiveTest.isSpace(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(SpaceToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else if (this.state.isParsingWord()) {
        if (PrimitiveTest.isLetter(cell)) {
          cache.push(cell)
        } else if (PrimitiveTest.isNumber(cell)) {
          throw new Error('Primitive parser in unexpected state')
        } else if (PrimitiveTest.isPeriod(cell)) {
          throw new Error('Primitive parser in unexpected state')
        } else if (PrimitiveTest.isSpace(cell)) {
          tokens.push(WordToken.parse(cache.join('')))
          tokens.push(SpaceToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else if (this.state.isParsingCommentStart()) {
        if (PrimitiveTest.isSpace(cell)) {
          tokens.push(SpaceToken.parse(cell))
          this.state.startParsingCommentBody()
        } else if (PrimitiveTest.isCommentLetter(cell)) {
          cache = [cell]
          this.state.startParsingCommentBody()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else if (this.state.isParsingCommentBody()) {
        if (PrimitiveTest.isCommentLetter(cell)) {
          cache.push(cell)
        } else if (PrimitiveTest.isCarriageReturn(cell)) {
          tokens.push(CommentToken.parse(cache.join('')))
          tokens.push(LineEndToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else {
        throw new Error('Primitive parser in unexpected state')
      }
    }
    if (cache.length > 0) {
      if (this.state.isParsingNumber()) {
        tokens.push(NumberToken.parse(cache.join('')))
      } else if (this.state.isParsingWord()) {
        tokens.push(WordToken.parse(cache.join('')))
      } else if (this.state.isParsingCommentBody()) {
        tokens.push(CommentToken.parse(cache.join('')))
      } else {
        throw new Error('Primitive parser in unexpected state')
      }
    }
    this.state.reset()
    return new TokenCollection(tokens)
  }


}
