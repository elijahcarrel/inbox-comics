declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}
