// ====================================
// AUTH ROUTES - Registration અને Login માટેના routes
// ====================================

// express Router - Routes define કરવા માટે
import express from "express";

// Auth controller functions import કરો
import { register, login } from "../controllers/auth.controller.js";

// Router instance બનાવો
const router = express.Router();

// ====================================
// ROUTES DEFINITION
// ====================================

/*
 * POST /api/auth/register
 * Description: નવો user register કરવા માટે
 * Body: { name, email, password }
 * Response: { success, message, data: { id, name, email, token } }
 */
router.post("/register", register);

/*
 * POST /api/auth/login
 * Description: Existing user login કરવા માટે
 * Body: { email, password }
 * Response: { success, message, data: { id, name, email, token } }
 */
router.post("/login", login);

// Router export કરો
export default router;

// ====================================
// HOW TO USE - કેવી રીતે use કરવું?
// ====================================

/*
 * POSTMAN/FRONTEND માંથી આ routes use કરવા:
 *
 * 1. REGISTER:
 *    Method: POST
 *    URL: http://localhost:5000/api/auth/register
 *    Body (JSON):
 *    {
 *      "name": "John Doe",
 *      "email": "john@example.com",
 *      "password": "123456"
 *    }
 *
 * 2. LOGIN:
 *    Method: POST
 *    URL: http://localhost:5000/api/auth/login
 *    Body (JSON):
 *    {
 *      "email": "john@example.com",
 *      "password": "123456"
 *    }
 *
 * Response મળશે:
 * {
 *   "success": true,
 *   "message": "Login successful!",
 *   "data": {
 *     "id": 1,
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 *
 * આ token frontend માં save કરજો અને subsequent requests માં use કરજો!
 */
