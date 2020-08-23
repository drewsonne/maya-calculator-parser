export default class PrimitiveTest {
  static isLetter(raw: string): boolean {
    return this.regexTest(raw, /^['a-zA-Z]$/)
  }

  static isCommentLetter(raw: string): boolean {
    return this.regexTest(raw, /[^\n]/)
  }

  static isNumber(cell: string): boolean {
    return this.regexTest(cell, /^\d$/)
  }

  static regexTest(cell: string, pattern: RegExp): boolean {
    const result = cell.match(pattern)
    return (result !== null)
  }

  static isPeriod(cell: string): boolean {
    return cell === '.'
  }

  static isCarriageReturn(cell: string) {
    return cell === "\n"
  }

  static isSpace(cell: string): boolean {
    return cell === ' '
  }

  static isWildcard(cell: string): boolean {
    return cell === '*'
  }

  static isCommentStart(cell: string): boolean {
    return cell === '#';
  }

  static isOperator(cell: string): boolean {
    return ['-', '+'].includes(cell)
  }
}
