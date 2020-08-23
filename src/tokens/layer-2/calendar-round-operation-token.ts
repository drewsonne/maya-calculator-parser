import {Token} from "../base";
import {IToken} from "../i-token";
import {isCalendarRoundToken, isOperatorToken} from "../../parsers/layer-2-test";


export default class CalendarRoundOperationToken extends Token<IToken[]> {
  static parse(operand1: IToken, operator: IToken, operand2: IToken): CalendarRoundOperationToken {
    if (isCalendarRoundToken(operand1)) {
      if (isOperatorToken(operator)) {
        if (isCalendarRoundToken(operand2)) {
          return new CalendarRoundOperationToken([operand1, operator, operand2])
        }
      }
    }
    throw new Error(`Could not parse: '${operand1}, ${operator}, ${operand2}'`)
  }

  equal(otherToken: IToken): boolean {
    if (otherToken instanceof CalendarRoundOperationToken) {
      return this.value[0].equal(otherToken.value[0]) &&
        this.value[1].equal(otherToken.value[1]) &&
        this.value[2].equal(otherToken.value[2])
    }
    return false;
  }
}
