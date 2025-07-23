import moo from 'moo'
import NumberToken from '../tokens/layer-0/number-token'
import PeriodToken from '../tokens/layer-0/period-token'
import SpaceToken from '../tokens/layer-0/space-token'
import WordToken from '../tokens/layer-0/word-token'
import WildcardToken from '../tokens/layer-0/wildcard-token'
import TokenCollection from '../tokens/collection'
import CommentToken from '../tokens/layer-0/comment-token'
import OperatorToken from '../tokens/layer-0/operator-token'
import { IToken } from '../tokens/i-token'
import { LineEndToken } from '../tokens/layer-0/line-end-token'

const lexer = moo.compile({
  space: / +/,
  number: /\d+/,
  word: /[A-Za-z']+/,
  period: '.',
  wildcard: '*',
  operator: /[-+]/,
  comment: /#[^\n]*/,
  newline: { match: /\n/, lineBreaks: true },
})

export default class Layer0Parser {
  parse(rawText: string): TokenCollection {
    lexer.reset(rawText)
    const tokens: IToken[] = []
    for (const tok of lexer) {
      switch (tok.type) {
        case 'number':
          tokens.push(NumberToken.parse(tok.value))
          break
        case 'word':
          tokens.push(WordToken.parse(tok.value))
          break
        case 'period':
          tokens.push(PeriodToken.parse(tok.value))
          break
        case 'space':
          for (let i = 0; i < tok.value.length; i++) {
            tokens.push(SpaceToken.parse(' '))
          }
          break
        case 'wildcard':
          tokens.push(WildcardToken.parse(tok.value))
          break
        case 'operator':
          tokens.push(OperatorToken.parse(tok.value))
          break
        case 'comment':
          tokens.push(CommentToken.parse(tok.value.slice(1).trim()))
          break
        case 'newline':
          tokens.push(LineEndToken.parse('\n'))
          break
        default:
          break
      }
    }
    return new TokenCollection(tokens).normaliseLineEndToken()
  }
}
