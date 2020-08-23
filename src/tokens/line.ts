import IPart from "@drewsonne/maya-dates/lib/i-part";
import Comment from "@drewsonne/maya-dates/lib/comment";

export default class Line<T> implements IPart {
  tokens: T[]
  comment: Comment | undefined

  constructor(tokens: T[]) {
    this.tokens = tokens
  }

  setComment(comment: string | Comment): Line<T> {
    if (!(comment instanceof Comment)) {
      comment = new Comment(comment)
    }
    this.comment = comment
    return this
  }

  equal(other: IPart): boolean {
    if (other instanceof Line) {
      throw new Error('Not Implemented')
    }
    return false
  }
}
