declare namespace PIXI {
  export interface Application {
    view: HTMLCanvasElement;
    screen: { width: number; height: number };
    stage: PIXI.Container;
    ticker: PIXI.Ticker;
    loader: PIXI.Loader;
    renderer: PIXI.Renderer;
    destroy(removeView?: boolean): void;
  }

  export interface Container extends DisplayObject {
    addChild(...children: DisplayObject[]): DisplayObject;
    removeChild(...children: DisplayObject[]): DisplayObject;
    removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[];
    children: DisplayObject[];
    width: number;
    height: number;
  }

  export interface DisplayObject {
    x: number;
    y: number;
    rotation: number;
    angle: number;
    pivot: Point;
    position: Point;
    scale: Point;
    anchor?: Point;
    visible: boolean;
    alpha: number;
    parent: Container;
    worldAlpha: number;
    worldTransform: Matrix;
    localTransform: Matrix;
    width: number;
    height: number;
    destroyed: boolean;
    destroy(): void;
  }

  export interface Sprite extends DisplayObject {
    anchor: Point;
    texture: Texture;
    tint: number;
    blendMode: number;
    pluginName: string;
    setTexture(texture: Texture): void;
  }

  export interface Point {
    x: number;
    y: number;
    set(x: number, y?: number): void;
    copy(point: Point): void;
    equals(point: Point): boolean;
    add(point: Point): void;
    subtract(point: Point): void;
    multiply(point: Point): void;
    divide(point: Point): void;
  }

  export interface Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    append(matrix: Matrix): Matrix;
    apply(pos: Point, newPos?: Point): Point;
    applyInverse(pos: Point, newPos?: Point): Point;
    rotate(angle: number): Matrix;
    scale(x: number, y: number): Matrix;
    translate(x: number, y: number): Matrix;
  }

  export interface Ticker {
    add(fn: (deltaTime: number) => void, context?: any): void;
    remove(fn: (deltaTime: number) => void, context?: any): void;
    start(): void;
    stop(): void;
    shared: Ticker;
    speed: number;
    deltaTime: number;
    lastTime: number;
  }

  export interface Text extends Sprite {
    text: string;
    style: TextStyle;
    width: number;
    height: number;
  }

  export interface TextStyle {
    align?: string;
    breakWords?: boolean;
    dropShadow?: boolean;
    dropShadowAlpha?: number;
    dropShadowAngle?: number;
    dropShadowBlur?: number;
    dropShadowColor?: string | number;
    dropShadowDistance?: number;
    fill?:
      | string
      | string[]
      | number
      | number[]
      | CanvasGradient
      | CanvasPattern;
    fontFamily?: string | string[];
    fontSize?: number | string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    letterSpacing?: number;
    lineHeight?: number;
    lineJoin?: string;
    miterLimit?: number;
    padding?: number;
    stroke?: string | number;
    strokeThickness?: number;
    trim?: boolean;
    textBaseline?: string;
    whiteSpace?: string;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    leading?: number;
  }

  export interface Texture extends GlobalMixins.Texture {
    baseTexture: BaseTexture;
    frame: Rectangle;
    trim: Rectangle;
    valid: boolean;
    width: number;
    height: number;
    orig: Rectangle;
    rotate: number;
    update(): void;
    destroy(destroyBase?: boolean): void;
  }

  export interface BaseTexture {
    width: number;
    height: number;
    realWidth: number;
    realHeight: number;
    resolution: number;
    scaleMode: number;
    hasLoaded: boolean;
    destroyed: boolean;
    destroy(): void;
  }

  export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    type: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    pad(paddingX: number, paddingY: number): void;
    fit(rectangle: Rectangle): void;
    enlarge(rectangle: Rectangle): void;
  }

  export interface ILoaderResource {
    texture: PIXI.Texture;
    textures?: { [key: string]: PIXI.Texture };
    url: string;
    name: string;
    data: any;
    error: Error;
    loading: boolean;
    loaded: boolean;
    failed: boolean;
  }

  export interface Loader {
    baseUrl: string;
    progress: number;
    loading: boolean;
    defaultQueryString: string;
    add(name: string, url: string, options?: any): this;
    add(url: string, options?: any): this;
    add(options?: any): this;
    pre(fn: (...params: any[]) => void): this;
    use(fn: (...params: any[]) => void): this;
    reset(): this;
    load(
      cb?: (
        loader: Loader,
        resources: { [key: string]: ILoaderResource }
      ) => void
    ): this;
    destroy(): void;
    onProgress: {
      add(fn: (loader: { progress: number }) => void): void;
    };
    onComplete: {
      add(fn: () => void): void;
    };
    onError: {
      add(fn: (error: Error) => void): void;
    };
    resources: {
      [key: string]: ILoaderResource;
    };
  }

  export const Loader: {
    shared: Loader;
    new (): Loader;
  };

  export const Sprite: {
    from(source: string | Texture): Sprite;
    new (texture: Texture): Sprite;
  };

  export const Texture: {
    from(
      source: string | HTMLImageElement | HTMLCanvasElement | BaseTexture
    ): Texture;
    new (baseTexture: BaseTexture): Texture;
  };

  export const Text: {
    new (text: string, style?: Partial<TextStyle>): Text;
  };

  export const Application: {
    new (options?: ApplicationOptions): Application;
  };
}

interface GlobalMixins {
  Texture: any;
}

interface Window {
  PIXI: typeof PIXI;
}
