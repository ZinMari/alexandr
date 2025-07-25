import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import ThumbView from "../../View/ThumbView/ThumbView";
import LineView from "../../View/LineView/LineView";
import getRandomInteger from "../../utils/getRandomInteger";

describe("Кнопки:", () => {
  const thumbs = new ThumbView({
    sliderLine: new LineView("lineClass"),
    thumbMinClass: "minClass",
    thumbMaxClass: "maxClass",
  });

  thumbs.updateType({ type: "double" });
  thumbs.setOrientation("horizontal");
  thumbs.updateFlagValues("max", 100);

  test("Обновляют значения флажков", () => {
    const oldMaxValueFlag = thumbs.maxThumb.attr("data-value");
    const oldMinValueFlag = thumbs.minThumb.attr("data-value");
    thumbs.updateFlagValues("max", 300);
    thumbs.updateFlagValues("min", 600);
    expect(oldMaxValueFlag).not.toBe(thumbs.maxThumb.attr("data-value"));
    expect(oldMinValueFlag).not.toBe(thumbs.minThumb.attr("data-value"));
  });
  test("Меняют ориентацию", () => {
    thumbs.setOrientation("vertical");
    expect(thumbs.maxThumb[0]).toHaveClass("alexandr__thumb_type_vertical");
  });
  test("Скрывают флажки", () => {
    thumbs.hideFlag();
    expect(thumbs.maxThumb[0]).not.toHaveClass("flag");
  });
  test("Показывают флажки", () => {
    thumbs.showFlag();
    expect(thumbs.minThumb[0]).toHaveClass("flag");
  });
  test("Обновляют позицию", () => {
    thumbs.updateThumbsPosition("max", 100, "left");
    expect(thumbs.maxThumb[0]).toHaveStyle({ left: "100px" });
  });
});
