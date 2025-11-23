// ====================================
// USER ROUTES - User management માટેના routes
// ====================================

// express Router - Routes define કરવા માટે
import express from "express";

// Auth middleware - Routes ને protect કરવા માટે (login required)
import { protect } from "../middlewares/auth.middleware.js";

// User controller functions import કરો
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteUserById,
} from "../controllers/user.controller.js";

// Router instance બનાવો
const router = express.Router();

// ====================================
// ROUTES DEFINITION - બધા routes protected છે (login required)
// ====================================

/*
 * GET /api/user/all
 * Description: બધા users ની list (Admin માટે)
 * Authorization: Required (JWT token)
 * Response: { success, count, data: [...users] }
 */
router.get("/all", protect, getAllUsers);

/*
 * GET /api/user/:id
 * Description: Specific user ની info ID થી મેળવો
 * Authorization: Required (JWT token)
 * Response: { success, data: { id, name, email, created_at } }
 */
router.get("/:id", protect, getUserById);

/*
 * PUT /api/user/update
 * Description: Logged in user ની info update કરો
 * Authorization: Required (JWT token)
 * Body: { name, email, password (optional) }
 * Response: { success, message, data: { updated user } }
 */
router.put("/update", protect, updateUser);

/*
 * DELETE /api/user/delete
 * Description: Logged in user ને delete કરો (પોતાનું account delete)
 * Authorization: Required (JWT token)
 * Response: { success, message }
 */
router.delete("/delete", protect, deleteUser);

/*
 * DELETE /api/user/:id
 * Description: Specific user ને delete કરો ID થી (Admin માટે)
 * Authorization: Required (JWT token)
 * Response: { success, message }
 */
router.delete("/:id", protect, deleteUserById);

// Router export કરો
export default router;

// ====================================
// HOW TO USE - કેવી રીતે use કરવું?
// ====================================

/*
 * POSTMAN/FRONTEND માંથી આ routes use કરવા માટે:
 *
 * IMPORTANT: બધા routes protected છે, તો Authorization header જરૂરી છે!
 * Header Format:
 * Authorization: Bearer <your_jwt_token>
 *
 *
 * 1. GET PROFILE:
 *    Method: GET
 *    URL: http://localhost:5000/api/user/profile
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 *
 * 2. GET ALL USERS:
 *    Method: GET
 *    URL: http://localhost:5000/api/user/all
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 *
 * 3. GET USER BY ID:
 *    Method: GET
 *    URL: http://localhost:5000/api/user/5
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 *
 * 4. UPDATE USER:
 *    Method: PUT
 *    URL: http://localhost:5000/api/user/update
 *    Headers: { "Authorization": "Bearer <token>" }
 *    Body (JSON):
 *    {
 *      "name": "Updated Name",
 *      "email": "newemail@example.com",
 *      "password": "newpassword123"  // optional
 *    }
 *
 *
 * 5. DELETE OWN ACCOUNT:
 *    Method: DELETE
 *    URL: http://localhost:5000/api/user/delete
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 *
 * 6. DELETE USER BY ID (Admin):
 *    Method: DELETE
 *    URL: http://localhost:5000/api/user/5
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 *
 * FRONTEND EXAMPLE (JavaScript):
 *
 * const token = localStorage.getItem('token');
 *
 * // Get Profile
 * fetch('http://localhost:5000/api/user/profile', {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': `Bearer ${token}`,
 *     'Content-Type': 'application/json'
 *   }
 * })
 * .then(response => response.json())
 * .then(data => console.log(data));
 *
 *
 * // Update User
 * fetch('http://localhost:5000/api/user/update', {
 *   method: 'PUT',
 *   headers: {
 *     'Authorization': `Bearer ${token}`,
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     name: 'New Name',
 *     email: 'newemail@example.com'
 *   })
 * })
 * .then(response => response.json())
 * .then(data => console.log(data));
 */
