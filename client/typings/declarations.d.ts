declare module "*.scss" {
  const content: {[className: string]: string};
  export = content;
}

// tslint:disable-next-line no-namespace
declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}
