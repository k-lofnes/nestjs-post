import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app-module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Server } from "http";

// Keep a cached instance of the app to improve cold starts
let cachedApp: any;

async function bootstrap() {
  // Reuse the existing app instance if it exists
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, {
      logger:
        process.env.NODE_ENV === "production"
          ? ["error", "warn"] // Reduce logging in production to improve performance
          : ["log", "error", "warn", "debug", "verbose"],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      })
    );

    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS || "*", // Configure CORS based on environment
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    });

    // Swagger setup - only in development
    if (process.env.NODE_ENV !== "production") {
      const config = new DocumentBuilder()
        .setTitle("NestJS Post API")
        .setDescription("API documentation for the NestJS Post service")
        .setVersion("1.0")
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("api", app, document);
    }

    // Cache the app instance
    cachedApp = app;
  }

  // For local development, listen on port
  if (process.env.NODE_ENV !== "production") {
    await cachedApp.listen(process.env.PORT || 3000);
    console.log(
      `Application is running on: http://localhost:${process.env.PORT || 3000}`
    );
  }

  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== "production") {
  bootstrap();
}

// For Vercel serverless deployment
export default async function handler(req: any, res: any) {
  try {
    // Get the app instance
    const app = await bootstrap();

    // Get the underlying HTTP server
    const server = app.getHttpAdapter().getInstance();

    // Process the request
    await new Promise<void>((resolve, reject) => {
      server(req, res, (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Serverless function error:", error);

    // Ensure we always send a response, even on error
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
}
