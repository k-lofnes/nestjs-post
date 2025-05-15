import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({
    description: "The title of the post",
    example: "My First Blog Post",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: "The content of the post",
    example: "This is the content of my first blog post.",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: "The author of the post",
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  author: string;
}
