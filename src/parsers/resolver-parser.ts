import TokenCollection from "../tokens/collection";
import IPart from "@drewsonne/maya-dates/lib/i-part";

export default class ResolverParser {
  parse(rawTokens: TokenCollection): IPart[] {
    const tokens: IPart[] = []
    for (let i = 0; i < rawTokens.length; i += 1) {
      const token = rawTokens.index(i)
      tokens.push(token)
    }
    return tokens
  }

}
