import { NavLink, Outlet, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/education", label: "Pregnancy Info" },
  { to: "/chatbot", label: "AI Chatbot" },
  { to: "/prediction", label: "GDM Prediction" },
  { to: "/tracker", label: "Health Tracker" },
  { to: "/lifestyle", label: "Diet & Exercise" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/extras", label: "Extra Care" },
];

function AppLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <h2>AI Pregnancy Care</h2>
        <p className="muted">Early pregnancy to safe delivery support</p>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className="side-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </aside>
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
