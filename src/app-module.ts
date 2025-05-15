import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "./posts/posts.module";
import * as path from "path";
import { Post } from "./posts/entities/post.entity";

@Module({
  imports: [
    // Load environment variables from Vercel's .env files
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // Look for Vercel environment files first
        path.resolve(process.cwd(), ".vercel", ".env.development.local"),
        // Fall back to project root environment files
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ],
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get("POSTGRES_URL");
        return {
          type: "postgres",
          url,
          entities: [Post],
          synchronize: configService.get("NODE_ENV") !== "production",
          ssl: {
            rejectUnauthorized: false, // Required for Neon connections
          },
        };
      },
    }),

    PostsModule,
  ],
})
export class AppModule {}
