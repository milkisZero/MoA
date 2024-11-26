const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "MoA Api Manual",
            version: "1.0.0",
            description: "MoA 프로젝트에 사용되는 API 설명 문서입니다.",
        },
        servers: [
            {
                url: "http://localhost:80800/",
            },
        ],
    },
    apis: ["./server.js", "./swagger/*"],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};