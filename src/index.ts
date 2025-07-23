import TokenCollection from './tokens/collection'
import Layer0Parser from './parsers/layer-0-parser'

/**
 * Parse the input string using the full pipeline of layer parsers.
 *
 * This is a convenience helper that tokenises the input and processes
 * each layer sequentially, returning the final TokenCollection.
 */
export function parse(input: string): TokenCollection {
  return new Layer0Parser()
    .parse(input)
    .processLayer1()
    .processLayer2()
    .processLayer3()
}

export { TokenCollection }

