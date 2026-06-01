import { Post } from "../../domain/post.entity";

export const POST_REPOSITORY = Symbol("POST_REPOSITORY");

export interface PostRepository {
  save(post: Post): Promise<void>;
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
}
