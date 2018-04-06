interface INothing {
  (): INothing;
  (p1: any): INothing;
  (p1: any, p2: any): INothing;
  (p1: any, p2: any, p3: any): INothing;
  (p1: any, p2: any, p3: any, p4: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any, p6: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any, p6: any, p7: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any, p6: any, p7: any, p8: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any, p6: any, p7: any, p8: any, p9: any): INothing;
  (p1: any, p2: any, p3: any, p4: any, p5: any, p6: any, p7: any, p8: any, p9: any, p10: any): INothing;
  [key: string]: INothing;
}

interface IFunctionProps {
  length: 0;
  name: string;
  prototype: object;
  toLocaleString(): "";
  toString(): "";
  valueOf(): false;
}

declare function toBool <T>(p: T): T extends INothing ? false : boolean;

declare function isNothing <T>(p: T): T extends INothing ? true : false;

declare function isSomething <T>(p: T): T extends INothing | null | void ? false : true;

declare function serialize (p: object): string;

declare function deserialize (p: string): object;

declare const Nothing: IFunctionProps & INothing;

export { Nothing, toBool, isNothing, isSomething, serialize, deserialize };
