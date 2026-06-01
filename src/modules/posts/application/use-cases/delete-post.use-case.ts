import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/domain/errors";
import { POST_REPOSITORY, PostRepository } from "../ports/post.repository";

export type DeletePostInput = {
  id: string;
};

export type DeletePostOuput = {
  success: boolean;
};

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: DeletePostInput): Promise<DeletePostOuput> {
    const post = await this.posts.findById(input.id);

    if (!post || post.isDeleted()) throw new NotFoundError("Post", input.id);

    post.delete();

    await this.posts.save(post);

    return {
      success: true,
    };
  }
}
