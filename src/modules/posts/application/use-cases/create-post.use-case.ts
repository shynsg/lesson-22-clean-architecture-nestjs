import { Inject, Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import { ConflictError } from "../../../../shared/domain/errors";
import { Post, PostPrimitives } from "../../domain/post.entity";
import {
  IDEMPOTENCY_REPOSITORY,
  IdempotencyRepository,
} from "../../../../shared/idempotency/application/idempotency-repository.port";
import { POST_REPOSITORY, PostRepository } from "../ports/post.repository";

export type CreatePostInput = {
  title: string;
  description: string;
  idempotencyKey?: string;
};

export type CreatePostOutput = {
  post: PostPrimitives;
  replayed: boolean;
};

function hashRequest(input: CreatePostInput) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        title: input.title,
        description: input.description,
      }),
    )
    .digest("hex");
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
    @Inject(IDEMPOTENCY_REPOSITORY)
    private readonly idempotency: IdempotencyRepository,
  ) {}

  async execute(input: CreatePostInput): Promise<CreatePostOutput> {
    const requestHash = hashRequest(input);
    const idempotencyKey = input.idempotencyKey
      ? `posts:create:${input.idempotencyKey}`
      : undefined;

    if (idempotencyKey) {
      const existing = await this.idempotency.findByKey<CreatePostOutput>(
        idempotencyKey,
      );

      if (existing) {
        if (existing.requestHash !== requestHash) {
          throw new ConflictError(
            "Idempotency-Key was already used with a different request body",
          );
        }

        return {
          ...existing.response,
          replayed: true,
        };
      }
    }

    const post = Post.create({
      id: randomUUID(),
      title: input.title,
      description: input.description,
    });

    const response = {
      post: post.toPrimitives(),
      replayed: false,
    };

    await this.posts.save(post);

    if (idempotencyKey) {
      await this.idempotency.save({
        key: idempotencyKey,
        requestHash,
        response,
        createdAt: new Date().toISOString(),
      });
    }

    return response;
  }
}
