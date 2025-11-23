// ====================================
// AUTH CONTROLLER - Registration અને Login માટે
// ====================================

// jsonwebtoken - Login પછી user ને token આપવા માટે
import jwt from "jsonwebtoken";

// bcryptjs - Password hash કરવા માટે
import bcrypt from "bcryptjs";

// User Model - Sequelize User model (database operations માટે)
import User from "../models/user.model.js";

// ====================================
// HELPER FUNCTION - JWT Token Generate કરવા માટે
// ====================================

/*
 * generateToken - User login થયા પછી JWT token બનાવે છે
 * @param {number} userId - User નું ID
 * @param {string} email - User નું email
 * @param {string} role - User નો role (admin/user)
 * @returns {string} - JWT token
 */
const generateToken = (userId, email, role) => {
  // jwt.sign() token generate કરે છે
  // પહેલો parameter: token માં store કરવાનો data (payload)
  // બીજો parameter: secret key (.env માંથી)
  // ત્રીજો parameter: options (expiresIn - કેટલા સમય માટે valid રહેશે)
  return jwt.sign(
    { id: userId, email: email, role: role }, // Payload - token માં user ની id, email અને role store થશે
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRE || "7d" }, // 7 દિવસ માટે valid
  );
};

// ====================================
// REGISTER - નવો user register કરવા માટે
// ====================================

/*
 * POST /api/auth/register
 * Request Body: { name, email, password, role }
 *
 * આ function શું કરે છે:
 * 1. User ની details (name, email, password, role) receive કરે
 * 2. Sequelize User.create() થી user create કરે
 * 3. Password automatic hash થાય છે
 * 4. JWT token generate કરે અને return કરે
 */
export const register = async (req, res) => {
  try {
    // Request body માંથી data લો (role optional છે, default 'user' રહેશે)
    const { name, email, password, role } = req.body;

    // ====================================
    // VALIDATION - Data valid છે કે નહીં check કરો
    // ====================================

    // Check: બધા fields આપેલા છે કે નહીં
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, password)",
      });
    }

    // Check: Email format valid છે કે નહીં
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check: Password ઓછામાં ઓછો 6 characters નો હોવો જોઈએ
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check: Role valid છે કે નહીં (optional field)
    // જો role આપેલ હોય તો 'admin' અથવા 'user' જ હોવું જોઈએ
    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'user'",
      });
    }

    // ====================================
    // CHECK EXISTING USER - Email already exist કરે છે કે નહીં
    // ====================================

    // Sequelize findOne() - Email થી user શોધો
    const existingUser = await User.findOne({
      where: { email: email },
    });

    // જો user મળે તો error return કરો
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login instead.",
      });
    }

    // ====================================
    // HASH PASSWORD - Password ને hash કરો
    // ====================================

    // bcrypt.hash() - Password ને hash કરે છે (10 = salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ====================================
    // CREATE USER - Sequelize થી નવો user create કરો
    // ====================================

    // User.create() - New user database માં insert કરે છે
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword, // Hashed password આપો
      role: role || "user", // Role આપેલ હોય તો use કરો, નહીં તો default 'user'
    });

    // ====================================
    // GENERATE TOKEN - User માટે JWT token બનાવો
    // ====================================

    const token = generateToken(user.id, user.email, user.role);

    // ====================================
    // SUCCESS RESPONSE - User ને response મોકલો
    // ====================================

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // User નો role (admin/user)
        token: token, // આ token frontend localStorage માં save કરશે
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    // Sequelize Validation Errors handle કરો
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    // Sequelize Unique Constraint Error (Duplicate email)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login instead.",
      });
    }

    // બીજી કોઈ error
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// ====================================
// LOGIN - Existing user login કરવા માટે
// ====================================

/*
 * POST /api/auth/login
 * Request Body: { email, password }
 *
 * આ function શું કરે છે:
 * 1. User ની email અને password receive કરે
 * 2. Sequelize findOne() થી user ને find કરે
 * 3. bcrypt.compare() થી password verify કરે
 * 4. Valid હોય તો JWT token generate કરે અને return કરે
 */
export const login = async (req, res) => {
  try {
    // Request body માંથી data લો
    const { email, password } = req.body;

    // ====================================
    // VALIDATION - Data valid છે કે નહીં check કરો
    // ====================================

    // Check: Email અને password બંને આપેલા છે કે નહીં
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ====================================
    // FIND USER - Sequelize થી user ને શોધો
    // ====================================

    /*
     * User.findOne() - Email થી user find કરો
     * Note: Password field toJSON() માં remove થાય છે
     * પણ login માટે password જોઈએ છે, તો આપણે explicitly select કરવો પડશે
     */
    const user = await User.findOne({
      where: { email: email },
      attributes: { include: ["password"] }, // Password પણ select કરો
    });

    // Check: User exist કરે છે કે નહીં
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ====================================
    // VERIFY PASSWORD - Password correct છે કે નહીં check કરો
    // ====================================

    /*
     * bcrypt.compare() - Plain password ને database ના hashed password સાથે compare કરે
     * પહેલો parameter: user એ enter કરેલો plain password
     * બીજો parameter: database માં stored hashed password
     * Returns: true જો match થાય, false જો ન થાય
     */
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // જો password match ન થાય તો error return કરો
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ====================================
    // UPDATE LAST LOGIN - Database માં last login time update કરો
    // ====================================

    // Sequelize update method - last_login field update કરો
    user.last_login = new Date();
    await user.save(); // Save changes to database

    // ====================================
    // GENERATE TOKEN - Login successful, token generate કરો
    // ====================================

    const token = generateToken(user.id, user.email, user.role);

    // ====================================
    // SUCCESS RESPONSE - User ને response મોકલો
    // ====================================

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // User નો role (admin/user)
        token: token, // Frontend આ token use કરશે subsequent requests માટે
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// ====================================
// HOW JWT AUTHENTICATION WORKS?
// ====================================

/*
 * JWT (JSON Web Token) આ રીતે કામ કરે છે:
 *
 * 1. REGISTRATION/LOGIN:
 *    - User register/login કરે
 *    - Server JWT token generate કરે
 *    - Frontend આ token localStorage માં save કરે
 *
 * 2. SUBSEQUENT REQUESTS:
 *    - Frontend દરેક API request સાથે token મોકલે (Header માં)
 *    - Header format: Authorization: Bearer <token>
 *    - Server token verify કરે
 *    - Valid હોય તો request process કરે
 *
 * 3. TOKEN STRUCTURE:
 *    Token માં 3 parts હોય છે (dot separated):
 *    - Header: Token type અને algorithm
 *    - Payload: User data (id, email, role)
 *    - Signature: Verification માટે
 *
 * 4. SECURITY:
 *    - Token server-side secret key થી signed છે
 *    - કોઈ token ને modify કરી શકતું નથી
 *    - Expiry time પછી token invalid થઈ જાય છે
 *
 * 5. FRONTEND USAGE:
 *    // Login time:
 *    localStorage.setItem('token', response.data.token);
 *
 *    // API calls:
 *    headers: {
 *      'Authorization': `Bearer ${localStorage.getItem('token')}`
 *    }
 *
 * 6. ROLE-BASED ACCESS:
 *    - Token માં role store છે
 *    - Middleware token માંથી role extract કરે છે
 *    - req.user.role થી controller માં role access થાય છે
 *    - Admin-only routes માટે checkAdmin middleware use કરો
 *
 * 7. SEQUELIZE BENEFITS:
 *    ✅ Clean અને readable code
 *    ✅ No SQL Injection
 *    ✅ Simple model definition (only fields)
 *    ✅ Easy CRUD operations
 */
