export class CustomLog {
  private static logMsg(func: Function, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      func.call(console, ...args);
    }
  }

  static log(...args: any[]) {
    this.logMsg(console.log, ...args);
  }

  static error(...args: any[]) {
    this.logMsg(console.error, ...args);
  }
}
