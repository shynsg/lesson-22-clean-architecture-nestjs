import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import {
  ConflictError,
  DomainError,
  ForbiddenError,
  InfrastructureError,
  NotFoundError,
} from "../../domain/errors";

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapped = this.mapError(error);

    response.status(mapped.statusCode).json({
      error: {
        code: mapped.code,
        message: mapped.message,
      },
    });
  }

  private mapError(error: unknown): {
    statusCode: number;
    code: string;
    message: string;
  } {
    if (error instanceof DomainError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof NotFoundError) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof ConflictError) {
      return {
        statusCode: HttpStatus.CONFLICT,
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof ForbiddenError) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof InfrastructureError) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        code: error.code,
        message: error.message,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
}
