// ====================================
// USER CONTROLLER - User management માટેના functions
// ====================================

// User Model - Sequelize User model (database operations માટે)
import User from "../models/user.model.js";

// ====================================
// GET ALL USERS - બધા users ની list (Admin માટે)
// ====================================

/*
 * GET /api/user/all
 * Description: બધા users ની list મેળવો
 * Authorization: Required (JWT token)
 * Response: { success, data: [...users] }
 */
export const getAllUsers = async (req, res) => {
  try {
    // Query parameters માંથી બધા filters લો (dynamic)
    const queryParams = req.query;

    // Where condition build કરો - કોઈ પણ query parameter automatically filter થશે
    const whereCondition = {};

    // બધા query parameters loop કરો અને where clause માં add કરો
    // Example: ?role=user&name=John&email=test@example.com
    Object.keys(queryParams).forEach((key) => {
      // Empty values skip કરો
      if (queryParams[key] && queryParams[key].trim() !== "") {
        whereCondition[key] = queryParams[key];
      }
    });

    // Sequelize findAll() - Users fetch કરો (dynamic filters સાથે અથવા વગર)
    // order: created_at descending order માં (newest first)
    const users = await User.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] }, // Password exclude કરો response માંથી
    });

    // Filter info માટે message
    const filterInfo =
      Object.keys(whereCondition).length > 0
        ? `Users filtered by: ${Object.keys(whereCondition).join(", ")}`
        : "All users fetched successfully";

    res.status(200).json({
      success: true,
      message: filterInfo,
      filters: whereCondition, // જે filters apply થયા છે તે બતાવો
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ====================================
// GET USER BY ID - Specific user ની details
// ====================================

/*
 * GET /api/user/:id
 * Description: ID થી specific user ની info મેળવો
 * Authorization: Required (JWT token)
 * Response: { success, data: { id, name, email, created_at } }
 */
export const getUserById = async (req, res) => {
  try {
    // URL params માંથી user ID લો
    const { id } = req.params;

    // Validation: ID number છે કે નહીં
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Sequelize findByPk() - Primary Key (ID) થી user find કરો
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Password exclude કરો
    });

    // Check: User exist કરે છે કે નહીં
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// ====================================
// UPDATE USER - User ની info update કરો
// ====================================

/*
 * PUT /api/user/update
 * Description: Logged in user ની info update કરો
 * Authorization: Required (JWT token)
 * Body: { name, email, password (optional) }
 * Response: { success, message, data: { updated user info } }
 */
export const updateUser = async (req, res) => {
  try {
    // Logged in user ની ID
    const userId = req.user.id;

    // Request body માંથી data લો
    const { name, email, password } = req.body;

    // ====================================
    // VALIDATION
    // ====================================

    // ઓછામાં ઓછું એક field તો update કરવાનું હોવું જોઈએ
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide at least one field to update (name, email, or password)",
      });
    }

    // Email update કરવો હોય તો valid format check કરો
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Check: નવો email already કોઈ બીજા user પાસે તો નથી ને?
      const existingUser = await User.findOne({
        where: { email: email },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another user",
        });
      }
    }

    // Password update કરવો હોય તો validation
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // ====================================
    // UPDATE USER - Sequelize થી update કરો
    // ====================================

    // Build update object - ફક્ત જે fields આપેલા હોય તે જ update કરો
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // Automatic hash થશે (beforeUpdate hook)

    /*
     * User.update() - Static method
     * પહેલો parameter: update કરવાનો data
     * બીજો parameter: where condition
     *
     * Password automatic hash થશે (beforeUpdate hook model માં)
     */
    await User.update(updateData, {
      where: { id: userId },
    });

    // Updated user info fetch કરો
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

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
        message: "Email already in use by another user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// ====================================
// DELETE USER - User ને delete કરો
// ====================================

/*
 * DELETE /api/user/delete
 * Description: Logged in user ને delete કરો
 * Authorization: Required (JWT token)
 * Response: { success, message }
 */
export const deleteUser = async (req, res) => {
  try {
    // Logged in user ની ID
    const userId = req.user.id;

    /*
     * User.destroy() - Static method
     * where condition થી user delete કરો
     * Returns: number of deleted rows
     */
    const deletedCount = await User.destroy({
      where: { id: userId },
    });

    // Check: Delete થયું કે નહીં
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// ====================================
// DELETE USER BY ID - Specific user ને delete કરો (Admin માટે)
// ====================================

/*
 * DELETE /api/user/:id
 * Description: ID થી specific user ને delete કરો
 * Authorization: Required (JWT token + Admin role)
 * Response: { success, message }
 */
export const deleteUserById = async (req, res) => {
  try {
    // URL params માંથી user ID લો
    const { id } = req.params;

    // Validation: ID number છે કે નહીં
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // પોતાને delete ન કરી શકે
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account using this endpoint",
      });
    }

    // Sequelize destroy() method - User delete કરો
    const deletedCount = await User.destroy({
      where: { id: id },
    });

    // Check: Delete થયું કે નહીં
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// ====================================
// SEQUELIZE METHODS USED - આ controller માં use થયેલા Sequelize methods
// ====================================

/*
 * 1. User.findAll() - બધા records fetch કરો
 *    Options: order, attributes, where, limit, offset
 *
 * 2. User.findByPk(id) - Primary key (ID) થી single record find કરો
 *    Options: attributes (include/exclude fields)
 *
 * 3. User.findOne() - Single record find કરો conditions સાથે
 *    Options: where, attributes, order
 *
 * 4. User.update(data, options) - Records update કરો
 *    Returns: [affectedCount]
 *    Note: beforeUpdate hook automatic run થાય છે
 *
 * 5. User.destroy(options) - Records delete કરો
 *    Returns: number of deleted rows
 *
 *
 * ADVANTAGES OVER RAW SQL:
 *
 * ✅ Clean અને readable code
 * ✅ No SQL Injection - Automatic protection
 * ✅ Password automatic hash થાય છે (hooks)
 * ✅ Validation automatic થાય છે
 * ✅ Password automatic response માંથી exclude થાય છે (toJSON)
 * ✅ Type-safe operations
 * ✅ Less code to write
 * ✅ Easy to maintain
 */
