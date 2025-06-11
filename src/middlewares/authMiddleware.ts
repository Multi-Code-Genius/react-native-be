import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env";

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET: string = SECRET_KEY;

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied: Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// go get -u entgo.io/ent/cmd/ent@latest
// go get -u ariga.io/atlas/cmd/atlas@latest
// go get -u github.com/gin-gonic/gin
// go install github.com/air-verse/air@latest
// go install github.com/swaggo/swag/cmd/swag@latest

// go get entgo.io/ent/cmd/ent
// go install github.com/air-verse/air@latest
// go run entgo.io/ent/cmd/ent init User
// go generate ./internal/ent
// go install ariga.io/atlas/cmd/atlas@latest
// go generate ./ent

//atlas schema inspect --url "postgresql://entuser:entpass@localhost:5433/ent_dev?sslmode=disable"

//docker pull nginx:latest

//docker run --rm -it -v ${PWD}:/app --network container:myapp-postgres arigaio/atlas migrate apply --url "postgresql://postgres:1234@localhost:5432/myapp?sslmode=disable" --dir file:///app/ent/migrate/migrations

// for gnrate new

//migrate create -ext sql -dir database/migrations add_phone_to_users

//docker run --rm -v ${pwd}/database/migrations:/migrations migrate/migrate up

//docker-compose down -v --remove-orphans
//docker-compose up --build
