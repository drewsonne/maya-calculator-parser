import 'mocha'
import {expect} from 'chai'
import FullParser from "../parsers/full-parser";
import IPart from "@drewsonne/maya-dates/lib/i-part";

describe('resolver/top-level parser', () => {
  it('should create @drewsonne/maya-dates object', () => {
    const actuals: IPart[] = new FullParser(`8.19.10.11 # (1) A long count date
+3.4 # (2) A distance number
-7.0

+1.1000 # (3) An 'invalid' distance number
# (4) An example of partial date matches.
9.10.*.5.* * Chikchan *Sip

`).run()
    const expecteds: IPart[] = []

    expect(actuals.length).to.eq(expecteds.length)
    for (let i = 0; i < expecteds.length; i += 1) {
      expect(actuals[i].equal(expecteds[i])).to.be.true
    }
  })
})
