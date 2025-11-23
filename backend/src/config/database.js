// ====================================
// SEQUELIZE DATABASE CONFIGURATION
// ====================================

// Sequelize - MySQL database સાથે work કરવા માટેનું ORM (Object-Relational Mapping)
import { Sequelize } from "sequelize";

// ====================================
// WHAT IS SEQUELIZE? - Sequelize શું છે?
// ====================================

/*
 * SEQUELIZE એક ORM (Object-Relational Mapping) tool છે જે:
 *
 * 1. Raw SQL queries લખવાની જરૂર નથી
 *    ખોટું: pool.query("SELECT * FROM users WHERE id = ?", [id])
 *    સાચું: User.findByPk(id)
 *
 * 2. JavaScript objects ને database tables સાથે map કરે છે
 *    const user = await User.create({ name: "John", email: "john@example.com" })
 *
 * 3. Database migrations અને validations automatically handle કરે છે
 *
 * 4. Multiple databases support કરે છે (MySQL, PostgreSQL, SQLite, etc.)
 *
 * 5. Type-safe અને clean code લખી શકાય છે
 */

// ====================================
// CREATE SEQUELIZE INSTANCE - Database connection setup
// ====================================

/*
 * Sequelize instance બનાવો database credentials સાથે
 *
 * Parameters:
 * 1. database name
 * 2. username
 * 3. password
 * 4. configuration object (host, dialect, logging, etc.)
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || "backendnormal", // Database name
  process.env.DB_USER || "root", // MySQL username
  process.env.DB_PASSWORD || "", // MySQL password
  {
    host: process.env.DB_HOST || "localhost", // Database host
    dialect: "mysql", // Database type (mysql, postgres, sqlite, etc.)
    port: process.env.DB_PORT || 3306, // MySQL port

    // Logging - Console માં SQL queries print કરવા માટે
    // false = SQL queries show નહીં થાય
    logging: false,

    // Connection Pool - Multiple connections manage કરવા માટે
    pool: {
      max: 10, // Maximum connections
      min: 0, // Minimum connections
      acquire: 30000, // Maximum time (ms) Sequelize will try to get connection
      idle: 10000, // Maximum time (ms) a connection can be idle before being released
    },

    // Timezone settings - India timezone માટે
    timezone: "+05:30",

    // Define settings - Model behavior
    define: {
      // Timestamps - createdAt અને updatedAt automatic add કરે
      timestamps: true,

      // Table names - Plural form automatically ન બનાવે (users -> users)
      freezeTableName: true,

      // Column naming - camelCase ને snake_case માં convert કરે
      // Example: createdAt -> created_at
      underscored: true,
    },
  },
);

// ====================================
// TEST CONNECTION - Database connection test કરો
// ====================================

/*
 * આ function database connection test કરે છે
 * Server start થતાં જ check કરે કે Sequelize properly connect થયું કે નહીં
 */
export const testSequelizeConnection = async () => {
  try {
    // authenticate() method connection test કરે છે
    await sequelize.authenticate();
    console.log("✅ Sequelize: Database Connected Successfully!");
    console.log(`📦 Database: ${process.env.DB_NAME || "backendnormal"}`);

    // Sync models with database (development માં)
    // આ automatically tables create/update કરશે
    if (process.env.NODE_ENV === "development") {
      // alter: true - Existing tables ને update કરશે (columns add/remove)
      // force: true - બધા tables delete કરીને ફરીથી બનાવશે (CAREFUL!)
      await sequelize.sync({ alter: true });
      console.log("✅ Sequelize: Models synced with database");
    }
  } catch (error) {
    console.error("❌ Sequelize: Database Connection Failed!");
    console.error("Error:", error.message);
    console.error("\n📌 Check કરો:");
    console.error("1. XAMPP/MySQL server running છે કે નહીં");
    console.error("2. .env file માં DB credentials correct છે કે નહીં");
    console.error("3. Database phpMyAdmin માં exist કરે છે કે નહીં");

    // Connection fail થયો તો server બંધ કરો
    process.exit(1);
  }
};

// ====================================
// EXPORT SEQUELIZE INSTANCE
// ====================================

// આ sequelize instance બધી model files માં use થશે
export default sequelize;

// ====================================
// HOW TO USE SEQUELIZE - કેવી રીતે use કરવું?
// ====================================

/*
 * MODEL DEFINE કરવું (user.model.js માં):
 *
 * import { DataTypes } from "sequelize";
 * import sequelize from "../config/database.js";
 *
 * const User = sequelize.define("users", {
 *   id: {
 *     type: DataTypes.INTEGER,
 *     primaryKey: true,
 *     autoIncrement: true
 *   },
 *   name: {
 *     type: DataTypes.STRING,
 *     allowNull: false
 *   },
 *   email: {
 *     type: DataTypes.STRING,
 *     allowNull: false,
 *     unique: true
 *   }
 * });
 *
 * export default User;
 *
 *
 * CRUD OPERATIONS:
 *
 * // Create
 * const user = await User.create({ name: "John", email: "john@example.com" });
 *
 * // Read (Find All)
 * const users = await User.findAll();
 *
 * // Read (Find One by ID)
 * const user = await User.findByPk(1);
 *
 * // Read (Find with condition)
 * const user = await User.findOne({ where: { email: "john@example.com" } });
 *
 * // Update
 * await User.update(
 *   { name: "John Updated" },
 *   { where: { id: 1 } }
 * );
 *
 * // Delete
 * await User.destroy({ where: { id: 1 } });
 *
 *
 * ADVANTAGES OVER RAW SQL:
 *
 * 1. No SQL Injection - Automatic protection
 * 2. Type Safety - Validation built-in
 * 3. Clean Syntax - Easy to read and write
 * 4. Migrations - Database schema versioning
 * 5. Relations - Easy to define (hasMany, belongsTo, etc.)
 */
