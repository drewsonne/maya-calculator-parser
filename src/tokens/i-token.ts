import Comment from "@drewsonne/maya-dates/lib/comment";

export interface IToken {
  equal(otherToken: IToken): boolean
  comment: Comment | undefined;
  value: any
}
