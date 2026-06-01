import { Inject, Injectable } from "@nestjs/common";
import { PostPrimitives } from "../../domain/post.entity";
import { POST_REPOSITORY, PostRepository } from "../ports/post.repository";

export type ListPostsOutput = {
  posts: PostPrimitives[];
};

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(): Promise<ListPostsOutput> {
    const posts = await this.posts.findAll();

    return {
      posts: posts.map((post) => post.toPrimitives()),
    };
  }
}
