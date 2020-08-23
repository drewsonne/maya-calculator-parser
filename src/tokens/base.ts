export abstract class Token<T> implements IToken {
  public value: T

  constructor(value: T) {
    this.value = value
  }

  abstract equal(otherToken: IToken): boolean

  toString(): string {
    return `${this.value}`
  }
}

export interface IToken {
  equal(otherToken: IToken): boolean

  value: any
}
