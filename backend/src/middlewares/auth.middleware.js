// ====================================
// AUTH MIDDLEWARE - JWT Token Verification
// ====================================

import jwt from "jsonwebtoken";

// ====================================
// PROTECT MIDDLEWARE - Token verify કરે અને user authenticate કરે
// ====================================

/*
 * આ middleware protected routes પર use થાય છે
 * Header માંથી token લઈને verify કરે છે
 *
 * Usage:
 * import { protect } from "../middlewares/auth.middleware.js";
 * router.get("/profile", protect, getUserProfile);
 */
export const protect = async (req, res, next) => {
  try {
    // ====================================
    // 1. CHECK TOKEN - Header માં token છે કે નહીં
    // ====================================

    // Authorization header check કરો
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // "Bearer token" માંથી ફક્ત token extract કરો
      token = req.headers.authorization.split(" ")[1];
    }

    // Check: Token છે કે નહીં
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login to access this resource.",
      });
    }

    // ====================================
    // 2. VERIFY TOKEN - Token valid છે કે નહીં
    // ====================================

    /*
     * jwt.verify() token ને decode અને verify કરે છે
     * જો token valid હોય તો payload return કરે છે
     * જો invalid/expired હોય તો error throw કરે છે
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded માં user ની info છે (id, email, role)
    // Example: { id: 1, email: "john@example.com", role: "user", iat: 1234567890, exp: 1234567890 }

    // ====================================
    // 3. SET USER - req.user માં decoded data set કરો
    // ====================================

    // Token માંથી મળેલી user info req.user માં store કરો
    // Controller માં આ req.user થી user ની id, email અને role access કરી શકાય
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, // User નો role (admin/user)
    };

    // ====================================
    // 4. NEXT - આગળની middleware/controller ને call કરો
    // ====================================

    // User authenticated છે, આગળ વધો
    next();
  } catch (error) {
    // Token verification fail થયું (invalid, expired, malformed)
    console.error("Auth Middleware Error:", error.message);

    // JWT specific errors handle કરો
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    // બીજી કોઈ error
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again.",
    });
  }
};

// ====================================
// HOW IT WORKS - કેવી રીતે કામ કરે છે?
// ====================================

/*
 * FLOW:
 *
 * 1. Client request કરે છે with token in header:
 *    Authorization: Bearer <token>
 *
 * 2. Middleware token extract કરે છે header માંથી
 *
 * 3. Token verify થાય છે JWT_SECRET સાથે
 *
 * 4. Valid હોય તો:
 *    - req.user માં { id, email } set થાય છે
 *    - next() call થાય છે - controller run થાય છે
 *
 * 5. Invalid હોય તો:
 *    - 401 Unauthorized response મળે છે
 *    - Controller run નથી થતું
 *
 *
 * FRONTEND USAGE:
 *
 * const token = localStorage.getItem('token');
 *
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
 * CONTROLLER માં ACCESS:
 *
 * export const getProfile = async (req, res) => {
 *   const userId = req.user.id;        // Token માંથી user ID
 *   const userEmail = req.user.email;  // Token માંથી user email
 *   const userRole = req.user.role;    // Token માંથી user role (admin/user)
 *
 *   // હવે આ ID use કરીને database માંથી full user info fetch કરો
 *   const user = await User.findByPk(userId);
 *   res.json({ success: true, data: user });
 * };
 */
