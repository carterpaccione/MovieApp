import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Request, Response } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { typeDefs, resolvers } from "./graphql/index.js";
import db from "./config/connection.js";
import { authenticationToken } from "./utils/auth.js";
import api_routes from "./api_routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, _res, next) => {
    console.log("Request received: ", req.method, req.url);
    console.log("Test dirname: ", __dirname);
    next();
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const context = await authenticationToken({ req, res });
        return context;
      },
    })
  );

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use("/api", api_routes);

  if (process.env.NODE_ENV === "production") {
    console.log(`In production mode, from NODE_ENV: ${process.env.NODE_ENV}`);
    // app.use(express.static(path.join(__dirname, "../../client/dist")));

    // app.get("*", (_req: Request, res: Response) => {
    //   res.sendFile(path.resolve(process.cwd(), "../../client/dist/index.html"));
    // });

    const clientBuildPath = path.join(process.cwd(), "client", "dist");

    app.use(express.static(clientBuildPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
