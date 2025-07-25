import Observer from "../../Observer/Observer";
import handlerClickOnSlider from "../../utils/handlerClickOnSlider";

class RulerView extends Observer<SubViewEvents> implements RulerView {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";
  divisions: JQuery<HTMLElement>[];
  countDivisions: number = 4;

  constructor() {
    super();
    this.item = $("<div>", { class: "alexandr__ruler" });
    this.divisions = new Array(this.countDivisions);

    for (let i = 0; i < this.countDivisions; i++) {
      this.divisions[i] = $("<span>", { class: "alexandr__dividing" });
      this.item.append(this.divisions[i]);
    }

    this.item[0].addEventListener("pointerdown", this.handler);
  }

  update(min: number, max: number): void {
    const stepRuler = (max - min) / (this.divisions.length - 1);

    $.each(this.divisions, function () {
      this.attr("data-dividing", Math.round(min));
      min += stepRuler;
    });
  }

  showRuler(): void {
    this.item.removeClass("alexandr__ruler_none");
  }

  hideRuler(): void {
    this.item.addClass("alexandr__ruler_none");
  }

  handler = (event: PointerEvent) => {
    handlerClickOnSlider.call(
      this,
      event,
      this.item,
      this.orientation,
      this.notify.bind(this),
    );
  };

  setVerticalOrientation() {
    this.orientation = "vertical";
    this.item.addClass("alexandr__ruler_type_vertical");
    this.divisions.forEach((elem: JQuery<HTMLElement>) => {
      elem.addClass("alexandr__dividing_type_vertical");
    });
  }

  setHorizontalOrientation() {
    this.orientation = "horizontal";
    this.item.removeClass("alexandr__ruler_type_vertical");
    this.divisions.forEach((elem: JQuery<HTMLElement>) => {
      elem.removeClass("alexandr__dividing_type_vertical");
    });
  }
}

export default RulerView;
