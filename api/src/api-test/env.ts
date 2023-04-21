/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import NodeEnvironment from "jest-environment-node";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoMemoryServerOpts } from "mongodb-memory-server-core/lib/MongoMemoryServer";
import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";

export type MongoDbEnvironmentConfig = JestEnvironmentConfig & {
  projectConfig: JestEnvironmentConfig["projectConfig"] & {
    testEnvironmentOptions?:
      | JestEnvironmentConfig["projectConfig"]["testEnvironmentOptions"]
      | MongoMemoryServerOpts;
  };
};

// Use a single shared mongod instance when Jest is launched with the
// --runInBand flag
let mongod: Promise<MongoMemoryServer> | null = null;

export default class ApiTestEnvironment extends NodeEnvironment {
  private readonly mongod: Promise<MongoMemoryServer>;

  constructor(config: MongoDbEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    if (this.runInBand) {
      if (!mongod) {
        mongod = MongoMemoryServer.create(
          config.projectConfig.testEnvironmentOptions,
        );
      }

      this.mongod = mongod;
    } else {
      this.mongod = MongoMemoryServer.create(
        config.projectConfig.testEnvironmentOptions,
      );
    }

    this.global.MONGOD = this.mongod;
  }

  public async setup(): Promise<void> {
    this.global.MONGO_URI = await (await this.mongod).getUri();

    mongoose.Promise = global.Promise;
    mongoose.set("debug", Boolean(process.env?.DEBUG));

    await super.setup();
  }

  public async teardown(): Promise<void> {
    if (!this.runInBand) {
      await (await this.mongod).stop();
    }

    await super.teardown();
  }

  // TODO(ecarrel): explore whether we can make this method static?
  // eslint-disable-next-line class-methods-use-this
  private get runInBand(): boolean {
    // '-i' is an alias for '--runInBand'
    // https://jestjs.io/docs/en/cli#runinband
    return process.argv.includes("--runInBand") || process.argv.includes("-i");
  }
}

module.exports = ApiTestEnvironment;
