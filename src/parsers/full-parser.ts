import Layer0Parser from "./layer-0-parser";
import IPart from "@drewsonne/maya-dates/lib/i-part";

export default class FullParser {
  private rawText: string;

  constructor(rawText: string) {
    this.rawText = rawText
  }

  run(): IPart[] {
    return new Layer0Parser()
      .parse(this.rawText)
      .processLayer1()
      .processLayer2()
      .processLayer3()
      .resolver()
  }
}
