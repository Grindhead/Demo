declare namespace PIXI {
  export interface Application {
    view: HTMLCanvasElement;
    screen: { width: number; height: number };
    stage: PIXI.Container;
    ticker: PIXI.Ticker;
  }

  export interface Container {
    addChild(child: PIXI.DisplayObject): void;
  }

  export interface DisplayObject {
    x: number;
    y: number;
    rotation: number;
    anchor?: Point;
  }

  export interface Sprite extends DisplayObject {
    anchor: Point;
  }

  export interface Point {
    set(x: number, y?: number): void;
  }

  export interface Ticker {
    add(fn: () => void): void;
  }

  export interface ApplicationOptions {
    width: number;
    height: number;
    backgroundColor: number;
    resolution: number;
  }

  export const Sprite: {
    from(url: string): PIXI.Sprite;
  };

  export const Application: {
    new (options: ApplicationOptions): Application;
  };

  export interface Graphics extends DisplayObject {
    beginFill(color: number, alpha?: number): Graphics;
    endFill(): Graphics;
    lineStyle(width: number, color: number, alpha?: number): Graphics;
    moveTo(x: number, y: number): Graphics;
    lineTo(x: number, y: number): Graphics;
    drawRect(x: number, y: number, width: number, height: number): Graphics;
    drawCircle(x: number, y: number, radius: number): Graphics;
    clear(): Graphics;
  }

  export const Graphics: {
    new (): Graphics;
  };
}

interface Window {
  PIXI: typeof PIXI;
}
