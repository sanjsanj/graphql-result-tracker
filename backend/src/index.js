const cookieParser = require("cookie-parser");

require("dotenv").config({ path: ".env" });

const createServer = require("./createServer");
const db = require("./db");
const server = createServer();

server.express.use(cookieParser());

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  data => {
    console.log(`Server listening on port ${data.port}`);
  }
);
