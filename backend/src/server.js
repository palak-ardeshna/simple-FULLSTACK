// ====================================
// IMPORTS - બધી જરૂરી packages import કરીએ
// ====================================

// dotenv - .env file માંથી environment variables વાંચવા માટે
import dotenv from "dotenv";

// express - Web server બનાવવા માટે main framework
import express from "express";

// cors - Different domain થી API access કરવા માટે (frontend-backend connection)
import cors from "cors";

// sequelize - Sequelize database connection (database.js માંથી)
// testSequelizeConnection - Database connection test કરવા માટેની function
import sequelize, { testSequelizeConnection } from "./config/database.js";

// Routes import કરો - index.js માંથી બધા routes import કરો
import { authRoutes, userRoutes } from "./routes/index.js";

// ====================================
// CONFIGURATION - Setup અને Configuration
// ====================================

// .env file માંથી variables load કરો (PORT, NODE_ENV વગેરે)
dotenv.config();

// Express નું instance બનાવો - આ આપણી main application છે
const app = express();

// Port number - .env માંથી લો અથવા default 5000 use કરો
const PORT = process.env.PORT || 5000;

// ====================================
// MIDDLEWARES - દરેક request પર run થતા functions
// ====================================

// 1. CORS middleware - Frontend (React/Vue) થી backend API call કરવા માટે જરૂરી
//    Without this, browser "CORS error" આપશે
app.use(cors());

// 2. JSON parser - Request body માં JSON data parse કરવા માટે
//    Example: { "name": "John", "age": 25 } આવો data વાંચી શકાય
app.use(express.json());

// 3. URL encoded data parser - Form data parse કરવા માટે
//    Example: name=John&age=25 આવો data વાંચી શકાય
app.use(express.urlencoded({ extended: true }));

// ====================================
// ROUTES - API endpoints
// ====================================

// ROOT ROUTE - "/" પર GET request
// Browser માં http://localhost:5000/ ખોલો તો આ response મળશે
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Backend API",
    status: "Server is running successfully!",
    version: "1.0.0",
  });
});

// API ROUTES - બધા routes mount કરો
// Auth Routes - Register અને Login માટે (No authentication required)
app.use("/api/auth", authRoutes);

// User Routes - User management માટે (Authentication required)
app.use("/api/user", userRoutes);

// ====================================
// SERVER START - Server ને listen mode માં મૂકો
// ====================================

/*
 * startServer function - Database connection પછી server start કરવા માટે
 * આ async function છે જેથી database connection ની રાહ જોઈ શકાય
 */
const startServer = async () => {
  try {
    // પહેલા Sequelize database connection test કરો
    await testSequelizeConnection();

    // Database connection successful થયા પછી જ server start કરો
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Server start કરો
startServer();

// ====================================
// HOW IT WORKS - કેવી રીતે કામ કરે છે?
// ====================================

/*
 * 1. Server start થાય છે port 5000 પર (અથવા .env માં જે port આપેલ હોય)
 *
 * 2. જ્યારે કોઈ request આવે (browser/Postman/frontend થી):
 *    - પહેલા બધા middlewares run થાય (cors, json parser)
 *    - પછી matching route find થાય (/, /api/users વગેરે)
 *    - Route નો handler function run થાય
 *    - Response client ને મોકલાય
 *
 * 3. Example flow:
 *    User -> Browser માં http://localhost:5000/ type કરે
 *    -> Server request receive કરે
 *    -> "/" route ને match કરે
 *    -> JSON response મોકલે
 *    -> Browser માં response દેખાય
 *
 * 4. Nodemon use કરવાથી:
 *    - કોઈ પણ file save કરો
 *    - Nodemon automatically server restart કરે
 *    - તમારે manually stop-start કરવાની જરૂર નથી
 */
