import { IsString, IsNumber, Min, MaxLength, MinLength } from "class-validator";

export class GetCommentById {
  @IsString()
  postId!: string;
}
