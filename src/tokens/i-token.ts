export interface IToken {
  equal(otherToken: IToken): boolean

  value: any
}
