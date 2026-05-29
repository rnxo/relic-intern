import { describe, it, expect } from "vitest";
import {
  getTimeBlockByHour,
  isBlockPassed,
  calculateBlockPoints,
  calculateExpression,
  TIME_BLOCK_MAX,
} from "./petCalculations";

describe("getTimeBlockByHour", () => {
  it("5〜10時はmorning", () => {
    expect(getTimeBlockByHour(5)).toBe("morning");
    expect(getTimeBlockByHour(10)).toBe("morning");
  });

  it("11〜17時はdaytime", () => {
    expect(getTimeBlockByHour(11)).toBe("daytime");
    expect(getTimeBlockByHour(17)).toBe("daytime");
  });

  it("18〜23時はnight", () => {
    expect(getTimeBlockByHour(18)).toBe("night");
    expect(getTimeBlockByHour(23)).toBe("night");
  });

  it("0〜4時はmidnight", () => {
    expect(getTimeBlockByHour(0)).toBe("midnight");
    expect(getTimeBlockByHour(4)).toBe("midnight");
  });

  it("境界値: 11時はmorningではなくdaytime", () => {
    expect(getTimeBlockByHour(11)).toBe("daytime");
  });

  it("境界値: 18時はdaytimeではなくnight", () => {
    expect(getTimeBlockByHour(18)).toBe("night");
  });
});

describe("isBlockPassed", () => {
  it("morningは終了時刻(11)以降でtrue", () => {
    expect(isBlockPassed("morning", 10)).toBe(false);
    expect(isBlockPassed("morning", 11)).toBe(true);
    expect(isBlockPassed("morning", 12)).toBe(true);
  });

  it("daytimeは終了時刻(18)以降でtrue", () => {
    expect(isBlockPassed("daytime", 17)).toBe(false);
    expect(isBlockPassed("daytime", 18)).toBe(true);
  });

  it("nightは終了時刻(24)以降でtrue（当日中は常にfalse）", () => {
    expect(isBlockPassed("night", 23)).toBe(false);
    expect(isBlockPassed("night", 24)).toBe(true);
  });

  it("midnightは終了時刻(5)以降でtrue", () => {
    expect(isBlockPassed("midnight", 4)).toBe(false);
    expect(isBlockPassed("midnight", 5)).toBe(true);
  });
});

describe("calculateBlockPoints", () => {
  describe("daytime / night (max=5)", () => {
    it.each([
      [0, { tp: -1, ep: 0 }],
      [1, { tp: -1, ep: 0 }],
      [2, { tp: 1, ep: 0 }],
      [3, { tp: 1, ep: 1 }],
      [4, { tp: 2, ep: 1 }],
      [5, { tp: 3, ep: 1 }],
    ])("count=%i のとき %o", (count, expected) => {
      expect(calculateBlockPoints("daytime", count)).toEqual(expected);
      expect(calculateBlockPoints("night", count)).toEqual(expected);
    });

    it("maxを超えた場合はep=max(5), tp=3", () => {
      expect(calculateBlockPoints("daytime", 6)).toEqual({ tp: 3, ep: 5 });
    });
  });

  describe("morning (max=3)", () => {
    it.each([
      [0, { tp: -2, ep: 0 }],
      [1, { tp: -2, ep: 0 }],
      [2, { tp: 1, ep: 1 }],
      [3, { tp: 2, ep: 1 }],
    ])("count=%i のとき %o", (count, expected) => {
      expect(calculateBlockPoints("morning", count)).toEqual(expected);
    });

    it("maxを超えた場合はep=max(3), tp=2", () => {
      expect(calculateBlockPoints("morning", 4)).toEqual({ tp: 2, ep: 3 });
    });
  });

  describe("midnight (max=2)", () => {
    it.each([
      [0, { tp: -1, ep: 0 }],
      [1, { tp: -1, ep: 0 }],
      [2, { tp: 2, ep: 1 }],
    ])("count=%i のとき %o", (count, expected) => {
      expect(calculateBlockPoints("midnight", count)).toEqual(expected);
    });

    it("maxを超えた場合はep=max(2), tp=2", () => {
      expect(calculateBlockPoints("midnight", 3)).toEqual({ tp: 2, ep: 2 });
    });
  });

  it("TIME_BLOCK_MAXの定義と整合している", () => {
    expect(TIME_BLOCK_MAX).toEqual({
      morning: 3,
      daytime: 5,
      night: 5,
      midnight: 2,
    });
  });
});

describe("calculateExpression", () => {
  it("trust>=65 かつ exhaustion<=30 でjoy", () => {
    expect(calculateExpression(65, 30)).toBe("joy");
    expect(calculateExpression(100, 0)).toBe("joy");
  });

  it("trustが65未満ならneutral", () => {
    expect(calculateExpression(64, 0)).toBe("neutral");
  });

  it("exhaustionが30超ならneutral", () => {
    expect(calculateExpression(100, 31)).toBe("neutral");
  });

  it("両条件を満たさない場合neutral", () => {
    expect(calculateExpression(0, 100)).toBe("neutral");
  });
});
