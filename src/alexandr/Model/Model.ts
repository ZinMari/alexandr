class SliderModel {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: "single" | "double";
  onThumbsPositionChanged?: (type: "min" | "max", position: number) => void;
  onStepValueChenged?: (
    minValue: number,
    maxValue: number,
    stepValue: number,
  ) => void;
  onMinMaxValuesChanged?: (minValue: number, maxValue: number) => void;

  init({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
  }: AlexandrSettings): {
    minValue: number;
    maxValue: number;
    minPosition: number;
    maxPosition: number;
    stepValue: number;
  } {
    this.type = type;
    this._setMaxValue(+maxValue);
    this._setMinValue(+minValue);
    this._setStepValue(+stepValue);
    this._setMaxValue(+maxValue);
    this.setMinPosition(+minPosition);
    if (this.type === "double") {
      this.setMaxPosition(+maxPosition!);
    }

    return {
      minValue: this.minValue,
      maxValue: this.maxValue,
      minPosition: this.minPosition,
      maxPosition: this.maxPosition,
      stepValue: this.stepValue,
    };
  }

  setMinPosition(minPosition: number): void {
    const typeValue = "min";

    let newPosition = this._equateValueToStep(minPosition);
    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }
    this.minPosition = newPosition;
    this.onThumbsPositionChanged?.("min", this.minPosition);
  }

  setMaxPosition(maxPosition: number): void {
    const typeValue = "max";
    let newPosition = this._equateValueToStep(maxPosition);
    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }

    this.maxPosition = newPosition;
    this.onThumbsPositionChanged?.("max", this.maxPosition);
  }

  bindThumbsPositionChanged(
    callback: (type: "min" | "max", position: number) => void,
  ): void {
    this.onThumbsPositionChanged = callback;
  }

  bindStepValueChanged(
    callback: (minValue: number, maxValue: number, stepValue: number) => void,
  ): void {
    this.onStepValueChenged = callback;
  }

  bindMinMaxValuesChanged(
    callback: (minValue: number, maxValue: number) => void,
  ): void {
    this.onMinMaxValuesChanged = callback;
  }

  _setMinValue(minValue: number): void {
    this.minValue = minValue || 0;

    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  _setMaxValue(maxValue: number): void {
    this.maxValue =
      maxValue <= this.minValue || Number.isNaN(maxValue)
        ? this.minValue + this.stepValue
        : maxValue;
    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  _setStepValue(stepValue: number): void {
    const isValueLessThanZero = stepValue <= 0;
    const isValueGreaterThanMax = stepValue >= this.maxValue;
    const valueIsNaN = Number.isNaN(stepValue);

    this.stepValue =
      isValueLessThanZero || valueIsNaN || isValueGreaterThanMax
        ? 1
        : stepValue;
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  _validatePosition(value: number): number {
    let validateValue;

    //проверю на пограничное минимальное
    validateValue = value <= this.minValue ? this.minValue : value;

    //проверю на пограничное максимальное
    validateValue =
      validateValue >= this.maxValue ? this.maxValue : validateValue;

    return validateValue;
  }

  _validateDoublePosition(type: "min" | "max", value: number): number {
    if (type === "min" && value >= this.maxPosition) {
      return this.maxPosition - this.stepValue;
    }
    if (type === "max" && value <= this.minPosition) {
      return this.minPosition + this.stepValue;
    }

    return value;
  }

  _equateValueToStep(value: number): number {
    return Math.round(value / this.stepValue) * this.stepValue || this.minValue;
  }
}

export default SliderModel;
