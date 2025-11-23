import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logout } from "../redux/slices/authSlice";
import { getAllUsers, deleteUserById } from "../redux/slices/userSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import "../styles/Dashboard.css";

// Global flag to prevent multiple simultaneous API calls
let globalFetchInProgress = false;
let globalFetchCompleted = false;

// Custom hook to fetch user data only once
const useFetchUserOnce = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Check all conditions before fetching
      if (
        !isAuthenticated ||
        (user && user.role) ||
        globalFetchInProgress ||
        globalFetchCompleted
      ) {
        return;
      }

      // Set global flag to prevent other components from fetching
      globalFetchInProgress = true;

      try {
        await dispatch(getCurrentUser()).unwrap();
        globalFetchCompleted = true;
      } catch {
        // Silently handle error - component will handle via Redux state
      } finally {
        if (mountedRef.current) {
          globalFetchInProgress = false;
        }
      }
    };

    fetchUser();

    return () => {
      mountedRef.current = false;
    };
  }, [dispatch, isAuthenticated, user]);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const { user, isAuthenticated, isLoading, isError, message } = useSelector(
    (state) => state.auth,
  );

  // Get users state from Redux
  const { users, isLoading: usersLoading } = useSelector((state) => state.user);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State for toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Use custom hook to fetch user data only once
  useFetchUserOnce();

  // Fetch users when admin logs in
  useEffect(() => {
    if (user && user.role === "admin") {
      // Fetch only users with role "user" - filters object સાથે
      dispatch(getAllUsers({ role: "user" }));
    }
  }, [user, dispatch]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Handle errors - redirect to login on auth error
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle delete user - Open confirmation modal
  const handleDeleteUser = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await dispatch(deleteUserById(userToDelete.id)).unwrap();
      setShowDeleteModal(false);
      setUserToDelete(null);
      // Show success toast
      setToastMessage(`User "${userToDelete.name}" deleted successfully!`);
      setToastType("success");
      setShowToast(true);
      // Refresh users list - ફરી fetch કરો
      dispatch(getAllUsers({ role: "user" }));
    } catch (error) {
      setShowDeleteModal(false);
      setUserToDelete(null);
      // Show error toast
      setToastMessage(error || "Failed to delete user. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div style={{ fontSize: "40px", marginBottom: "20px" }}>⏳</div>
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="logo">Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {isError && message && <div className="error-message">{message}</div>}

        <div className="welcome-section">
          <h2>Welcome, {user.name}! 👋</h2>
          <p className="user-email">Email: {user.email}</p>
          <p
            className="user-id"
            style={{ color: "#999", fontSize: "14px", margin: "5px 0" }}
          >
            User ID: {user.id}
          </p>
          <div className="user-role">
            <span
              className={`role-badge ${user.role === "admin" ? "role-admin" : "role-user"}`}
            >
              {user.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
            <span
              style={{ marginLeft: "10px", color: "#666", fontSize: "14px" }}
            >
              Role: <strong>{user.role}</strong>
            </span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Statistics</h3>
            <p>View your activity statistics</p>
            <div className="card-value">0</div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Tasks</h3>
            <p>Manage your tasks</p>
            <div className="card-value">0</div>
          </div>

          {user?.role === "admin" ? (
            <>
              <div
                className="dashboard-card"
                style={{ border: "2px solid #ffd700" }}
              >
                <div className="card-icon">👥</div>
                <h3>Users Management</h3>
                <p>Total registered users</p>
                <div className="card-value">{users.length}</div>
              </div>

              <div
                className="dashboard-card"
                style={{ border: "2px solid #ffd700" }}
              >
                <div className="card-icon">⚙️</div>
                <h3>Admin Settings</h3>
                <p>Manage system preferences</p>
                <div className="card-value">-</div>
              </div>
            </>
          ) : (
            <div className="dashboard-card">
              <div className="card-icon">📧</div>
              <h3>Messages</h3>
              <p>Your messages</p>
              <div className="card-value">0</div>
            </div>
          )}

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your preferences</p>
            <div className="card-value">-</div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p className="activity-title">Account Created</p>
                <p className="activity-time">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Just now"}
                </p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🔐</div>
              <div className="activity-content">
                <p className="activity-title">Logged In</p>
                <p className="activity-time">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "Just now"}
                </p>
              </div>
            </div>
            {user.role === "admin" && (
              <div
                className="activity-item"
                style={{ backgroundColor: "#fff9e6" }}
              >
                <div className="activity-icon">👑</div>
                <div className="activity-content">
                  <p className="activity-title">Admin Access Granted</p>
                  <p className="activity-time">Full system access</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table - ફક્ત Admin માટે */}
        {user?.role === "admin" && (
          <div className="users-table-section">
            <h3>📋 Users Management (Role: User)</h3>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              નીચે ફક્ત "user" role ધરાવતા users બતાવેલ છે
            </p>

            {usersLoading ? (
              <div className="table-loading-state">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading users...</div>
                <div className="loading-subtext">
                  Please wait while we fetch the data
                </div>
              </div>
            ) : users.length > 0 ? (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td>{userItem.id}</td>
                        <td>{userItem.name}</td>
                        <td>{userItem.email}</td>
                        <td>
                          <span className="role-badge role-user">
                            {userItem.role}
                          </span>
                        </td>
                        <td>
                          {new Date(userItem.created_at).toLocaleDateString(
                            "en-GB",
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleDeleteUser(userItem.id, userItem.name)
                            }
                            className="btn-delete"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "10px", color: "#666" }}>
                  Total Users: {users.length}
                </div>
              </div>
            ) : (
              <div className="table-empty-state">
                <div className="empty-icon">👤</div>
                <div className="empty-title">No Users Found</div>
                <div className="empty-message">
                  કોઈ user role વાળા users નથી મળ્યા
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete User"
        message={
          userToDelete
            ? `શું તમે ખરેખર "${userToDelete.name}" ને delete કરવા માંગો છો? આ action ને undo કરી શકાશે નહીં.`
            : "શું તમે ખરેખર આ user ને delete કરવા માંગો છો?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </div>
  );
};

export default Dashboard;
