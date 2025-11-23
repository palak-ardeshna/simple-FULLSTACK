// ====================================
// ADMIN ROUTE - ફક્ત Admin Users માટે
// ====================================

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/*
 * AdminRoute Component
 *
 * આ component ફક્ત admin users ને જ specific routes access કરવા દે છે
 *
 * કેવી રીતે કામ કરે છે:
 * 1. Redux માંથી user અને authentication status ચેક કરે છે
 * 2. જો user login નથી તો /login redirect કરે છે
 * 3. જો user login છે પણ admin નથી તો /dashboard redirect કરે છે
 * 4. જો user admin છે તો requested page show કરે છે
 *
 * Usage:
 * <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
 */
const AdminRoute = ({ children }) => {
  // Redux માંથી auth state લો
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  // Loading state - જ્યારે authentication check થઈ રહ્યું હોય
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  // ====================================
  // CHECK 1: User Authenticated છે કે નહીં
  // ====================================

  // જો user login નથી તો login page પર redirect કરો
  if (!isAuthenticated || !user) {
    console.log("❌ User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // ====================================
  // CHECK 2: User Admin છે કે નહીં
  // ====================================

  // જો user login છે પણ role "admin" નથી તો dashboard redirect કરો
  if (user.role !== "admin") {
    console.log("❌ User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // ====================================
  // SUCCESS: User Admin છે, Page Show કરો
  // ====================================

  console.log("✅ Admin access granted");
  return children;
};

export default AdminRoute;

// ====================================
// EXAMPLE USAGE - કેવી રીતે Use કરવું
// ====================================

/*
 * App.jsx માં:
 *
 * import AdminRoute from "./components/AdminRoute";
 * import AdminPanel from "./pages/AdminPanel";
 *
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/" element={<Home />} />
 *         <Route path="/login" element={<Login />} />
 *         <Route path="/register" element={<Register />} />
 *
 *         // Normal User Dashboard
 *         <Route
 *           path="/dashboard"
 *           element={
 *             <ProtectedRoute>
 *               <Dashboard />
 *             </ProtectedRoute>
 *           }
 *         />
 *
 *         // Admin Only Page
 *         <Route
 *           path="/admin"
 *           element={
 *             <AdminRoute>
 *               <AdminPanel />
 *             </AdminRoute>
 *           }
 *         />
 *
 *         <Route
 *           path="/admin/users"
 *           element={
 *             <AdminRoute>
 *               <UserManagement />
 *             </AdminRoute>
 *           }
 *         />
 *       </Routes>
 *     </Router>
 *   );
 * }
 *
 *
 * FLOW DIAGRAM:
 *
 * User tries to access /admin
 *         ↓
 * AdminRoute Component
 *         ↓
 *   Is Authenticated? ────→ No ──→ Redirect to /login
 *         ↓ Yes
 *   Is Admin? ────────────→ No ──→ Redirect to /dashboard
 *         ↓ Yes
 *   Show Admin Page ✅
 */
