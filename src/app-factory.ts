import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import express, { Request, Response } from "express";
import { Express } from "express";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./app-module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export class AppFactory {
  static create(): {
    appPromise: Promise<INestApplication<any>>;
    expressApp: Express;
  } {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const appPromise = NestFactory.create(AppModule, adapter);

    appPromise
      .then(async (app) => {
        // You can add all required app configurations here

        /**
         * Enable cross-origin resource sharing (CORS) to allow resources to be requested from another domain.
         * @see {@link https://docs.nestjs.com/security/cors}
         */
        app.enableCors({
          exposedHeaders: "*",
        });

        // Swagger setup
        const config = new DocumentBuilder()
          .setTitle("NestJS Post API")
          .setDescription("API documentation for the NestJS Post service")
          .setVersion("1.0")
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api", app, document);

        await app.init();
      })
      .catch((err) => {
        throw err;
      });

    // IMPORTANT This express application-level middleware makes sure the NestJS app is fully initialized
    expressApp.use((req: Request, res: Response, next) => {
      appPromise
        .then(async (app) => {
          await app.init();
          next();
        })
        .catch((err) => next(err));
    });

    return { appPromise, expressApp };
  }
}

// For Vercel serverless deployment
export default async function handler(req: any, res: any) {
  try {
    // Get the app instance and express app
    const { appPromise, expressApp } = AppFactory.create();
    await appPromise; // Ensure Nest app is initialized

    // Process the request using Express
    await new Promise<void>((resolve, reject) => {
      expressApp(req, res, (err: any) => {
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
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
}
