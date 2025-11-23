import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Home.css";

const Home = () => {
  // Get authentication state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">
            Welcome to <span className="gradient-text">Your App</span>
          </h1>
          <p className="home-subtitle">
            Start your journey with us today. Manage your tasks, track your
            progress, and achieve your goals.
          </p>

          <div className="home-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-home btn-primary-home">
                  Go to Dashboard
                </Link>
                <p style={{ color: "white", marginTop: "10px" }}>
                  Welcome back, {user?.name}! 👋
                </p>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-home btn-primary-home">
                  Get Started
                </Link>
                <Link to="/login" className="btn-home btn-secondary-home">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast & Efficient</h3>
            <p>Built with modern technologies for optimal performance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Your data is protected with industry-standard security</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Easy to Use</h3>
            <p>Intuitive interface designed for everyone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
