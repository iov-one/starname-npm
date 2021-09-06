export class Pager {
  private changeHandler: (page: Pager) => void;
  public readonly size: number;
  public number: number;

  constructor(size: number, current = 1) {
    this.changeHandler = () => undefined;
    this.size = size;
    this.number = current;
  }

  public get isFirst(): boolean {
    return true;
  }

  public get isLast(): boolean {
    return true;
  }

  public next(): void {
    // FIXME: enable circular paging
    if (this.number === this.size - 1) return;
    // Notify the change if there's a listener
    this.number += 1;
    this.changeHandler(this);
  }

  public previous(): void {
    // FIXME: enable circular paging
    if (this.number === 0) return;
    // Notify the change if there's a listener
    this.number -= 1;
    this.changeHandler(this);
  }

  public onChange(fn: (page: Pager) => void): void {
    this.changeHandler = fn;
  }
}
