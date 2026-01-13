/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { Logger } from 'app/core/logger/logger.service';
 *
 * const log = new Logger('myFile');
 * ...
 * log.debug('something happened');
 * ```
 *
 * To disable debug and info logs in production, add this snippet to your root component:
 * ```
 * export class AppComponent implements OnInit {
 *   ngOnInit() {
 *     if (environment.production) {
 *       Logger.enableProductionMode();
 *     }
 *     ...
 *   }
 * }
 *
 * If you want to process logs through other outputs than console, you can add LogOutput functions to Logger.outputs.
 */

/**
 * The possible log levels.
 * LogLevel.Off is never emitted and only used with Logger.level property to disable logs.
 */
export enum LogLevel {
  Off = 0,
  Error,
  Warning,
  Info,
  Debug
}

/**
 * Log output handler function.
 */
export type LogOutput = (source: string, level: LogLevel, ...objects: any[]) => void;

/**
 * Loki log output handler for external log aggregation.
 * Sends logs to a Loki instance if configured.
 */
export class LokiOutput {
  private lokiUrl: string | null = null;
  private batchSize = 10;
  private batchTimeout = 5000;
  private logBatch: any[] = [];
  private batchTimer: any = null;

  constructor() {
    const lokiUrl = (window as any).env?.lokiUrl;
    if (lokiUrl) {
      this.lokiUrl = lokiUrl;
    }
  }

  handler: LogOutput = (source: string, level: LogLevel, ...objects: any[]) => {
    if (!this.lokiUrl) {
      return;
    }

    const timestamp = Date.now() * 1000000;
    const levelName = LogLevel[level].toLowerCase();
    const message = objects.map((obj) => (typeof obj === 'object' ? JSON.stringify(obj) : String(obj))).join(' ');

    const logEntry = {
      stream: {
        app: 'mifos-web-app',
        level: levelName,
        source: source || 'unknown'
      },
      values: [[
          timestamp.toString(),
          message
        ]]
    };

    this.logBatch.push(logEntry);

    if (this.logBatch.length >= this.batchSize) {
      this.flush();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flush(), this.batchTimeout);
    }
  };

  private flush() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.logBatch.length === 0 || !this.lokiUrl) {
      return;
    }

    const payload = {
      streams: this.logBatch
    };

    const batch = this.logBatch;
    this.logBatch = [];

    fetch(`${this.lokiUrl}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Silently fail to avoid logging errors about logging
    });
  }
}

export class Logger {
  /**
   * Current logging level.
   * Set it to LogLevel.Off to disable logs completely.
   */
  static level = LogLevel.Debug;

  /**
   * Additional log outputs.
   */
  static outputs: LogOutput[] = [];

  /**
   * Enables production mode.
   * Sets logging level to LogLevel.Warning.
   */
  static enableProductionMode() {
    Logger.level = LogLevel.Warning;
  }

  constructor(private source?: string) {}

  /**
   * Logs messages or objects  with the debug level.
   * Works the same as console.log().
   */
  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects);
  }

  /**
   * Logs messages or objects  with the info level.
   * Works the same as console.log().
   */
  info(...objects: any[]) {
    this.log(console.info, LogLevel.Info, objects);
  }

  /**
   * Logs messages or objects  with the warning level.
   * Works the same as console.log().
   */
  warn(...objects: any[]) {
    this.log(console.warn, LogLevel.Warning, objects);
  }

  /**
   * Logs messages or objects  with the error level.
   * Works the same as console.log().
   */
  error(...objects: any[]) {
    this.log(console.error, LogLevel.Error, objects);
  }

  private log(func: Function, level: LogLevel, objects: any[]) {
    if (level <= Logger.level) {
      const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects;
      func.apply(console, log);
      Logger.outputs.forEach((output) =>
        output.apply(
          output,
          [
            this.source,
            level
          ].concat(objects)
        )
      );
    }
  }
}
