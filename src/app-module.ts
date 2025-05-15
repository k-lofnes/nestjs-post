import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get("DATABASE_URL"),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: false, // Set to false in production
      }),
    }),
    PostsModule,
  ],
})
export class AppModule {}
