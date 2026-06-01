export class DomainError extends Error {
  readonly code = "DOMAIN_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class NotFoundError extends Error {
  readonly code = "NOT_FOUND";

  constructor(resource: string, id: string) {
    super(`${resource} ${id} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  readonly code = "CONFLICT";

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class InfrastructureError extends Error {
  readonly code = "INFRASTRUCTURE_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "InfrastructureError";
  }
}
