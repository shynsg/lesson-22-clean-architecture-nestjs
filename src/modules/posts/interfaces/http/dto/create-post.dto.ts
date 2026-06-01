import { IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;
}

export class GetPostDto {
  @IsString()
  id!: string;
}
