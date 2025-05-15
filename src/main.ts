import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app-module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Swagger setup
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("NestJS Post API")
      .setDescription("API documentation for the NestJS Post service")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
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
