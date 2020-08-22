export default class ParserError extends Error {
  constructor(layer: number) {
    super(`Layer-${layer} parser in unexpected state`);
  }
}
