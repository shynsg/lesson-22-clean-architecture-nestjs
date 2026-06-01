import { PostPrimitives } from "../../domain/post.entity";

export class PostPresenter {
  static toHttp(post: PostPrimitives) {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt
    };
  }
}
