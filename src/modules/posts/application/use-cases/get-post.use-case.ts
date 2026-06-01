import { Inject, Injectable } from "@nestjs/common";
import { PostPrimitives } from "../../domain/post.entity";
import { POST_REPOSITORY, PostRepository } from "../ports/post.repository";
import { NotFoundError } from "../../../../shared/domain/errors";
import { GetPostDto } from "../../interfaces/http/dto/create-post.dto";

export type PostOutput = {
  post: PostPrimitives;
};

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: GetPostDto): Promise<PostOutput> {
    const post = await this.posts.findById(input.id);

    if (!post || post.isDeleted()) throw new NotFoundError("Post", input.id);

    return {
      post: post.toPrimitives(),
    };
  }
}
