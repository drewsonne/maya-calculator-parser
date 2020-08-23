import {IToken} from "./i-token";
import Comment from "@drewsonne/maya-dates/lib/comment";

export abstract class Token<T> implements IToken {
  public value: T

  constructor(value: T) {
    this.value = value
  }

  abstract equal(otherToken: IToken): boolean

  toString(): string {
    return `${this.value}`
  }

  comment: Comment | undefined;
}

