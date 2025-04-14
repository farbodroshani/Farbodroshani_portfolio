import { AppError } from '../types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: Error, component: string): AppError {
    const appError: AppError = {
      code: this.generateErrorCode(error),
      message: error.message,
      component,
      timestamp: new Date(),
    };

    this.errorLog.push(appError);
    this.logError(appError);
    return appError;
  }

  private generateErrorCode(error: Error): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(error: AppError): void {
    console.error(`[${error.timestamp.toISOString()}] Error in ${error.component}:`, {
      code: error.code,
      message: error.message,
    });
  }

  public getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance(); 