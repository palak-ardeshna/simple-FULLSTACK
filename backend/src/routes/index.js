// ====================================
// ROUTES INDEX - બધા routes ને export કરવા માટે
// ====================================

// Auth routes import કરો
import authRoutes from "./auth.routes.js";

// User routes import કરો
import userRoutes from "./user.routes.js";

// ====================================
// EXPORT ALL ROUTES
// ====================================

/*
 * આ file માંથી બધા routes export થાય છે
 * server.js માં ફક્ત આ એક file import કરવી પડશે
 *
 * Usage in server.js:
 * import { authRoutes, userRoutes } from "./routes/index.js";
 * app.use("/api/auth", authRoutes);
 * app.use("/api/user", userRoutes);
 */

export { authRoutes, userRoutes };
