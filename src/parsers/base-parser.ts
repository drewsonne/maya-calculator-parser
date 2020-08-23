import {IToken} from "../tokens/i-token";
import LineEndToken from "../tokens/layer-0/line-end-token";
import {Token} from "../tokens/base";
import TokenCollection from "../tokens/collection";

export default abstract class BaseParser {
  abstract parse(rawTokens: TokenCollection): TokenCollection;

  appendLineEnd(tokens: IToken[]): IToken[] {
    if (tokens.length > 0) {
      if (!(tokens[tokens.length - 1] instanceof LineEndToken)) {
        tokens.push(LineEndToken.parse("\n"))
      }
    } else {
      tokens.push(LineEndToken.parse("\n"))
    }
    return tokens
  }
}
