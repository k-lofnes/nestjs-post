import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // For local development
  if (process.env.NODE_ENV !== "production") {
    await app.listen(3000);
  }

  return app;
}

// For local development
if (process.env.NODE_ENV !== "production") {
  bootstrap();
}

// For Vercel serverless deployment
export default bootstrap;
