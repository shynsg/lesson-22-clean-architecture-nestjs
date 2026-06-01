import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreatePostUseCase } from "../../application/use-cases/create-post.use-case";
import { DeletePostUseCase } from "../../application/use-cases/delete-post.use-case";
import { GetPostUseCase } from "../../application/use-cases/get-post.use-case";
import { ListPostsUseCase } from "../../application/use-cases/list-posts.use-case";
import { UpdatePostUseCase } from "../../application/use-cases/update-post.use-case";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostPresenter } from "./post.presenter";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly getPostsUseCase: GetPostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreatePostDto,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    const result = await this.createPostUseCase.execute({
      title: dto.title,
      description: dto.description,
      idempotencyKey,
    });

    return {
      post: PostPresenter.toHttp(result.post),
      replayed: result.replayed,
    };
  }

  @Get()
  async list() {
    const result = await this.listPostsUseCase.execute();

    return {
      posts: result.posts.map(PostPresenter.toHttp),
    };
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const result = await this.getPostsUseCase.execute({ id });

    return {
      post: PostPresenter.toHttp(result.post),
    };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdatePostDto) {
    const result = await this.updatePostUseCase.execute({ id, ...dto });

    return {
      post: PostPresenter.toHttp(result.post),
    };
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.deletePostUseCase.execute({ id });
  }
}
