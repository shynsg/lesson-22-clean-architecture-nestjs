import { IsString, MaxLength, MinLength, IsOptional } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @IsString()
  @IsOptional()
  description!: string;
}
