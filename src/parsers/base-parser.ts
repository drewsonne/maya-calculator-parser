import {IToken} from "../tokens/i-token";
import LineEndToken from "../tokens/layer-0/line-end-token";

export default abstract class BaseParser {
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
