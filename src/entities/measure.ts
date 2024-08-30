export type MeasureProps = {
  measure_uuid: string;
  measure_value: number;
  measure_type: MeasureType;
  measure_datetime: Date;
  customer_code: string;
  has_confirmed: boolean;
  image_url: string;
}

export type MeasureType = "WATER" | "GAS" | string;

export class Measure {
  private constructor(readonly props: MeasureProps) {}

  public static create(props: Omit<MeasureProps, "measure_uuid" | "has_confirmed">) {
    return new Measure({
      ...props,
      measure_uuid: crypto.randomUUID().toString(),
      has_confirmed: false,
    });
  }

  public static with(data: MeasureProps) {
    return new Measure(data);
  }

  public get measure_uuid() {
    return this.props.measure_uuid;
  }

  public get measure_value() {
    return this.props.measure_value;
  }

  public get measure_type() {
    return this.props.measure_type;
  }

  public get measure_datetime() {
    return this.props.measure_datetime;
  }

  public get customer_code() {
    return this.props.customer_code;
  }

  public get has_confirmed() {
    return this.props.has_confirmed;
  }

  public get image_url() {
    return this.props.image_url;
  }

  public confirm() {
    this.props.has_confirmed = true;
  }

  public updateValue(value: number) {
    if(!Number.isInteger(value)) {
      throw new Error("Value must be an integer");
    }
    this.props.measure_value = value;
  }
}