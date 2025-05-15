import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import type { CreatePostDto } from "./dto/create-post.dto";
import type { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({
    status: 201,
    description: "The post has been successfully created.",
    type: PostEntity,
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all posts" })
  @ApiResponse({
    status: 200,
    description: "Return all posts.",
    type: [PostEntity],
  })
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by id" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 200,
    description: "Return the post.",
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: "Post not found." })
  findOne(@Param("id") id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 200,
    description: "The post has been successfully updated.",
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: "Post not found." })
  update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 204,
    description: "The post has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Post not found." })
  remove(@Param("id") id: string): Promise<void> {
    return this.postsService.remove(+id);
  }
}

