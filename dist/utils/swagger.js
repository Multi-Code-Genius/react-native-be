"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Express API with Swagger",
        version: "1.0.0",
        description: "This is a simple API documentation using Swagger"
    },
    servers: [
        {
            url: "https://reactnativebe-ympr.onrender.com",
            description: "deploy server"
        },
        {
            url: "http://localhost:5000",
            description: "Local server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};
var options = {
    definition: swaggerDefinition,
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};
var swaggerSpec = (0, swagger_jsdoc_1.default)(options);
var setupSwagger = function (app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log("📄 Swagger Docs available at: https://reactnativebe-ympr.onrender.com/api-docs");
};
exports.setupSwagger = setupSwagger;
