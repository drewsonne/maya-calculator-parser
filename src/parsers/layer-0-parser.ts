import Layer0Test from "./layer-0-test";
import NumberToken from "../tokens/layer-0/number-token";
import PeriodToken from "../tokens/layer-0/period-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import SpaceToken from "../tokens/layer-0/space-token";
import WordToken from "../tokens/layer-0/word-token";
import WildcardToken from "../tokens/layer-0/wildcard-token";
import TokenCollection from "../tokens/collection";
import OperatorToken from "../tokens/layer-0/operator-token";
import {IToken} from "../tokens/i-token";
import CommentToken from "../tokens/layer-0/comment-token";
import BaseParser from "./base-parser";

enum Layer0ParserStateValue {
  WAITING,
  PARSING_NUMBER,
  PARSING_WORD,
  PARSING_COMMENT_BODY,
}

class Layer0ParserState {
  private state: Layer0ParserStateValue

  constructor() {
    this.state = Layer0ParserStateValue.WAITING
  }

  reset() {
    this.state = Layer0ParserStateValue.WAITING
  }

  isWaiting(): boolean {
    return this.state === Layer0ParserStateValue.WAITING
  }

  isParsingNumber(): boolean {
    return this.state === Layer0ParserStateValue.PARSING_NUMBER
  }

  isParsingWord(): boolean {
    return this.state === Layer0ParserStateValue.PARSING_WORD
  }

  isParsingCommentBody(): boolean {
    return this.state === Layer0ParserStateValue.PARSING_COMMENT_BODY
  }

  startParsingNumber() {
    this.state = Layer0ParserStateValue.PARSING_NUMBER
  }

  startParsingWord() {
    this.state = Layer0ParserStateValue.PARSING_WORD
  }

  startParsingComment() {
    this.state = Layer0ParserStateValue.PARSING_COMMENT_BODY
  }

}

export default class Layer0Parser extends BaseParser {
  private state: Layer0ParserState

  constructor() {
    super();
    this.state = new Layer0ParserState()
  }

  parse(rawText: string): TokenCollection {
    let tokens: IToken[] = []
    let cache: string[] = []
    for (let cursor = 0; cursor < rawText.length; cursor += 1) {
      const cell = rawText[cursor];
      if (this.state.isWaiting()) {
        if (Layer0Test.isLetter(cell)) {
          this.state.startParsingWord()
          cache.push(cell)
        } else if (Layer0Test.isNumber(cell)) {
          this.state.startParsingNumber()
          cache.push(cell)
        } else if (Layer0Test.isPeriod(cell)) {
          tokens.push(PeriodToken.parse(cell))
        } else if (Layer0Test.isSpace(cell)) {
          tokens.push(SpaceToken.parse(cell))
        } else if (Layer0Test.isWildcard(cell)) {
          tokens.push(WildcardToken.parse(cell))
        } else if (Layer0Test.isOperator(cell)) {
          tokens.push(OperatorToken.parse(cell))
          this.state.reset()
        } else if (Layer0Test.isCarriageReturn(cell)) {
          tokens.push(LineEndToken.parse(cell))
        } else if (Layer0Test.isCommentStart(cell)) {
          this.state.startParsingComment()
        } else {
          throw new Error('Primitive parser in unexpected state')
        }
      } else if (this.state.isParsingNumber()) {
        if (Layer0Test.isLetter(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          cache = [cell]
          this.state.startParsingWord()
        } else if (Layer0Test.isNumber(cell)) {
          cache.push(cell)
        } else if (Layer0Test.isPeriod(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(PeriodToken.parse(cell))
          cache = []
          this.state.reset()
        } else if (Layer0Test.isCarriageReturn(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(LineEndToken.parse(cell))
          cache = []
          this.state.reset()
        } else if (Layer0Test.isSpace(cell)) {
          tokens.push(NumberToken.parse(cache.join('')))
          tokens.push(SpaceToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          throw new Error('Layer-0 parser in unexpected state')
        }
      } else if (this.state.isParsingWord()) {
        if (Layer0Test.isLetter(cell)) {
          cache.push(cell)
        } else if (Layer0Test.isNumber(cell)) {
          throw new Error('Layer-0 parser in unexpected state')
        } else if (Layer0Test.isPeriod(cell)) {
          throw new Error('Layer-0 parser in unexpected state')
        } else if (Layer0Test.isSpace(cell)) {
          tokens.push(WordToken.parse(cache.join('')))
          tokens.push(SpaceToken.parse(cell))
          cache = []
          this.state.reset()
        } else if (Layer0Test.isCarriageReturn(cell)) {
          tokens.push(WordToken.parse(cache.join('')))
          tokens.push(LineEndToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          throw new Error('Layer-0 parser in unexpected state')
        }
      } else if (this.state.isParsingCommentBody()) {
        if ((cache.length === 0) && Layer0Test.isSpace(cell)) {
          continue
        }
        if (Layer0Test.isCarriageReturn(cell)) {
          tokens.push(CommentToken.parse(cache.join('')))
          tokens.push(LineEndToken.parse(cell))
          cache = []
          this.state.reset()
        } else {
          cache.push(cell)
        }
      } else {
        throw new Error('Layer-0 parser in unexpected state')
      }
    }
    if (cache.length > 0) {
      if (this.state.isParsingNumber()) {
        tokens.push(NumberToken.parse(cache.join('')))
        cache = []
      } else if (this.state.isParsingWord()) {
        tokens.push(WordToken.parse(cache.join('')))
        cache = []
      } else if (this.state.isParsingCommentBody()) {
        tokens.push(CommentToken.parse(cache.join('')))
        cache = []
      } else {
        throw new Error('Layer-0 parser in unexpected state')
      }
    }

    this.state.reset()
    return new TokenCollection(
      this.appendLineEnd(tokens)
    );
  }

}
