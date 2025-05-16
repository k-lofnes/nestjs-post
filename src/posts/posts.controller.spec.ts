import { Test, TestingModule } from "@nestjs/testing";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity";

// Mock PostsService
const mockPostsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe("PostsController", () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a post", async () => {
      const createPostDto: CreatePostDto = {
        title: "Test Post",
        content: "Test Content",
        author: "Test Author",
      };
      const expectedResult: PostEntity = {
        id: 1,
        ...createPostDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostsService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createPostDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of posts", async () => {
      const expectedResult: PostEntity[] = [
        {
          id: 1,
          title: "Test Post",
          content: "Test Content",
          author: "Test Author",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPostsService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single post", async () => {
      const postId = "1";
      const expectedResult: PostEntity = {
        id: 1,
        title: "Test Post",
        content: "Test Content",
        author: "Test Author",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostsService.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(postId)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+postId);
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const postId = "1";
      const updatePostDto: UpdatePostDto = { title: "Updated Post" };
      const expectedResult: PostEntity = {
        id: 1,
        title: "Updated Post",
        content: "Test Content",
        author: "Test Author",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostsService.update.mockResolvedValue(expectedResult);

      expect(await controller.update(postId, updatePostDto)).toBe(
        expectedResult
      );
      expect(service.update).toHaveBeenCalledWith(+postId, updatePostDto);
    });
  });

  describe("remove", () => {
    it("should remove a post", async () => {
      const postId = "1";
      mockPostsService.remove.mockResolvedValue(undefined);

      await controller.remove(postId);
      expect(service.remove).toHaveBeenCalledWith(+postId);
    });
  });
});

