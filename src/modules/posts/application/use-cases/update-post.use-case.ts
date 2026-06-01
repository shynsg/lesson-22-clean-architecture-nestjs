import { Inject, Injectable } from "@nestjs/common";
import { PostPrimitives } from "../../domain/post.entity";
import { POST_REPOSITORY, PostRepository } from "../ports/post.repository";
import { NotFoundError } from "../../../../shared/domain/errors";

export type UpdatePostInput = {
  id: string;
  title?: string;
  description?: string;
};

export type UpdatePostOutput = {
  post: PostPrimitives;
};

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: UpdatePostInput): Promise<UpdatePostOutput> {
    const post = await this.posts.findById(input.id);

    if (!post || post.isDeleted()) throw new NotFoundError("Post", input.id);

    post.update({ title: input.title, description: input.description });

    await this.posts.save(post);

    return {
      post: post.toPrimitives(),
    };
  }
}
