import { Outlet, NavLink, useNavigate } from "react-router-dom";

import "./AppLayout.css";

const links = [

  { to: "/", label: "Dashboard" },

  { to: "/education", label: "Pregnancy Info" },

  { to: "/chatbot", label: "AI Chatbot" },

  { to: "/prediction", label: "GDM Prediction" },

  { to: "/tracker", label: "Health Tracker" },

  { to: "/lifestyle", label: "Diet & Exercise" },

  { to: "/hospitals", label: "Hospitals" },

];

function AppLayout() {


  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/auth");
  };

  return (

    <div className="app-layout">

      {/* GLOBAL NAVBAR */}

      <header className="global-navbar">

        {/* LOGO */}

        <div className="navbar-logo">

          <h1>AI Pregnancy Care</h1>

          <p>
            Smart maternal healthcare support
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="global-nav-links">

          {links.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >

              {link.label}

            </NavLink>

          ))}

        </nav>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          Logout

        </button>

      </header>

      {/* PAGE CONTENT */}

      <main className="global-page-content">

        <Outlet />

      </main>

    </div>
  );
}

export default AppLayout;