import Layer0Parser from "./layer-0-parser";
import IPart from "@drewsonne/maya-dates/lib/i-part";
import TokenCollection from "../tokens/collection";

export default class FullParser {
  private rawText: string;

  constructor(rawText: string) {
    this.rawText = rawText
  }

  run(): TokenCollection {
    return new Layer0Parser()
      .parseRaw(this.rawText)
      .processLayer1()
      .processLayer2()
      .processLayer3()
    // .resolver()
  }
}
