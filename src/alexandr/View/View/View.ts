import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

class View extends Observer<ViewEvents> implements View {
  ruler: RulerView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  thumbs: ThumbView;
  progressbar: ProgressBarView;
  private slider: JQuery<HTMLElement>;
  private container: JQuery<HTMLElement>;
  private line: LineViewInterface;
  private thumbMinClass: string;
  private thumbMaxClass: string;
  private showMinValueClass: string;
  private showMaxValueClass: string;
  private lineClass: string;
  private progressBarClass: string;

  constructor({
    container,
    lineClass,
    thumbMinClass,
    thumbMaxClass,
    showMinValueClass,
    showMaxValueClass,
    progressBarClass,
  }: AlexandrSettings) {
    super();
    this.container = container;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
    this.showMinValueClass = showMinValueClass;
    this.showMaxValueClass = showMaxValueClass;
    this.lineClass = lineClass;
    this.progressBarClass = progressBarClass;
  }

  setInitialValues() {
    this._createBaseDOM();
    this._initSubViews();
    this._appendToDOM();
    this._notifyInitialCoords();
    this._addSubscribersToSubViews();
  }

  private _createBaseDOM = () => {
    this.slider = $("<div>", { class: "alexandr" });
  };

  private _initSubViews = () => {
    this.line = new LineView(this.lineClass);
    this.progressbar = new ProgressBar(this.progressBarClass);
    this.thumbs = new ThumbView({
      sliderLine: this.line,
      thumbMinClass: this.thumbMinClass,
      thumbMaxClass: this.thumbMaxClass,
    });
    this.sliderMinMaxValueLine = new MinMaxValueLineView(
      this.showMinValueClass,
      this.showMaxValueClass,
    );
    this.ruler = new RulerView();
  };

  private _appendToDOM = () => {
    this.container.append(this.slider);
    this.slider.append(
      this.sliderMinMaxValueLine.item,
      this.line.item,
      this.ruler.item,
    );
    this.line.item.append(
      this.progressbar.item,
      this.thumbs.minThumb,
      this.thumbs?.maxThumb,
    );
  };

  private _notifyInitialCoords = () => {
    this.notify("viewInit", {
      sliderLength:
        this.slider.outerWidth() - this.thumbs.minThumb.outerWidth(),
      minThumbWidth: this.thumbs.minThumb.outerWidth(),
      minThumbHeight: this.thumbs.minThumb.outerHeight(),
      maxThumbWidth: this.thumbs.maxThumb?.outerWidth(),
      maxThumbHeight: this.thumbs.maxThumb?.outerHeight(),
    });
  };

  updateType(dataObject: ModelEvents["modelTypeChanged"]): void {
    this.thumbs.updateType(dataObject);
  }

  updateProgressBar(dataObject: ModelEvents["modelProgressbarUpdated"]): void {
    this.progressbar.update(dataObject);
  }

  updateRuler({ min, max }: ModelEvents["modelMinMaxValuesChanged"]): void {
    this.ruler.update(min, max);
  }

  updateShowRuler({ isSetRuler }: ModelEvents["modelSetRulerChanged"]) {
    isSetRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
  }

  updateShowFlag({ isSetValueFlag }: ModelEvents["modelShowFlagChanged"]) {
    isSetValueFlag ? this.thumbs.showFlag() : this.thumbs.hideFlag();
  }

  updateOrientation({ orientation }: ModelEvents["modelOrientationChanged"]) {
    orientation === "vertical"
      ? this._setVerticalOrientation()
      : this._setHorizontalOrientation();
  }

  updateMinMaxValueLine({
    min,
    max,
  }: ModelEvents["modelMinMaxValuesChanged"]): void {
    this.sliderMinMaxValueLine.update(min, max);
  }

  updateThumbsPosition({
    type,
    pixelPosition,
    moveDirection,
  }: Partial<ModelEvents["modelThumbsPositionChanged"]>): void {
    this.thumbs.updateThumbsPosition(type, pixelPosition, moveDirection);
  }

  updateFlagValues({
    type,
    currentValue,
  }: Partial<ModelEvents["modelThumbsPositionChanged"]>): void {
    this.thumbs.updateFlagValues(type, currentValue);
  }

  private _addSubscribersToSubViews() {
    this.line.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.ruler.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.thumbs.addSubscriber(
      "updateThumbPosition",
      this._handlerUpdateThumbPosition,
    );
  }

  private _handlerUpdateThumbPosition = (options: UpdateThumbData) => {
    this.notify("viewThumbsPositionChanged", options);
  };

  private _handlerClickOnSlider = ({
    pixelClick,
  }: SubViewEvents["clickOnSlider"]) => {
    this.notify("clickOnSlider", {
      pixelClick,
    });
  };

  private _setVerticalOrientation(): void {
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(this.slider.outerWidth());
    this.line.setVerticalOrientation();
    this.thumbs.setOrientation("vertical");
    this.ruler.setVerticalOrientation();
    this.sliderMinMaxValueLine.setVerticalOrientation();
  }

  private _setHorizontalOrientation(): void {
    this.slider.removeClass("alexandr_type_vertical");
    this.slider.width("100%");
    this.line.setHorizontalOrientation();
    this.thumbs.setOrientation("horizontal");
    this.ruler.setHorizontalOrientation();
    this.sliderMinMaxValueLine.setHorizontalOrientation();
  }

  destroy() {
    this.slider.remove();
    this._destroySubscribers();
  }

  private _destroySubscribers() {
    this.line.removeAllSubscribers("clickOnSlider");
    this.ruler.removeAllSubscribers("clickOnSlider");
    this.thumbs.removeAllSubscribers("updateThumbPosition");
  }
}
export default View;
