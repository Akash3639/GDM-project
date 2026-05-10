import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiBase, setToken } from "../api";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    pregnancy_start_date: "",
    preferred_language: "en",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "", new_password: "" });

  const getApiError = (err, fallback) => {
    if (err?.code === "ERR_NETWORK") return `Cannot connect to backend server at ${getApiBase()}.`;
    const detail = err?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((it) => it.msg).join(" | ");
    return fallback;
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { ...registerForm, age: Number(registerForm.age) });
      const login = await api.post("/auth/login", { email: registerForm.email, password: registerForm.password });
      setToken(login.data.access_token);
      navigate("/");
    } catch (err) {
      setError(getApiError(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const login = await api.post("/auth/login", loginForm);
      setToken(login.data.access_token);
      navigate("/");
    } catch (err) {
      setError(getApiError(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", forgotForm);
      setMode("login");
    } catch (err) {
      setError(getApiError(err, "Password reset failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{minHeight: '100vh'}}>
      <div className="auth-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #be185d, #7c3aed)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 10px 30px rgba(190, 24, 93, 0.3)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
              <rect x="4" y="2" width="16" height="20" rx="8"/>
            </svg>
          </div>
          <h1 style={{margin: 0, fontSize: '1.75rem', color: '#0f172a'}}>AI Pregnancy Care</h1>
          <p className="muted" style={{marginTop: '0.5rem', fontSize: '0.95rem'}}>Safe motherhood, smarter decisions, better outcomes.</p>
        </div>

        {mode === "register" && (
          <form onSubmit={submitRegister}>
            <input placeholder="Full Name" onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <input placeholder="Age" type="number" min={18} max={50} onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <input placeholder="Email" type="email" onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              minLength={8}
              maxLength={16}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$"
              required
              style={{padding: '0.9rem 1rem', fontSize: '1rem'}}
            />
            <label className="inline-label" style={{marginBottom: '0.5rem'}}>
              <input type="checkbox" onChange={(e) => setShowPassword(e.target.checked)} style={{width: 'auto'}} />
              <span style={{marginLeft: '0.5rem'}}>Show password</span>
            </label>
            <p className="hint">Use 8-16 chars with uppercase, lowercase, number and special character.</p>
            <label className="muted" style={{marginTop: '0.5rem', display: 'block'}}>Pregnancy Start Date</label>
            <input type="date" onChange={(e) => setRegisterForm({ ...registerForm, pregnancy_start_date: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <button disabled={loading} style={{padding: '1rem', fontSize: '1rem', marginTop: '1rem'}}>{loading ? "Creating Account..." : "Create Account"}</button>
          </form>
        )}

        {mode === "login" && (
          <form onSubmit={submitLogin}>
            <input placeholder="Email" type="email" onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              minLength={8}
              maxLength={16}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$"
              required
              style={{padding: '0.9rem 1rem', fontSize: '1rem'}}
            />
            <label className="inline-label" style={{marginBottom: '0.5rem'}}>
              <input type="checkbox" onChange={(e) => setShowPassword(e.target.checked)} style={{width: 'auto'}} />
              <span style={{marginLeft: '0.5rem'}}>Show password</span>
            </label>
            <button disabled={loading} style={{padding: '1rem', fontSize: '1rem', marginTop: '0.5rem'}}>{loading ? "Signing in..." : "Login"}</button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={submitForgot}>
            <input placeholder="Email" type="email" onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <input placeholder="New Password" type="password" onChange={(e) => setForgotForm({ ...forgotForm, new_password: e.target.value })} required style={{padding: '0.9rem 1rem', fontSize: '1rem'}} />
            <button disabled={loading} style={{padding: '1rem', fontSize: '1rem', marginTop: '1rem'}}>{loading ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}

        {!!error && <p className="error" style={{marginTop: '1rem'}}>{error}</p>}
        
        <div className="auth-links" style={{marginTop: '1.5rem'}}>
          <button className="btn-link" onClick={() => setMode("login")} style={{fontSize: '0.95rem'}}>Login</button>
          <span style={{color: '#d1d5db'}}>|</span>
          <button className="btn-link" onClick={() => setMode("register")} style={{fontSize: '0.95rem'}}>Register</button>
          <span style={{color: '#d1d5db'}}>|</span>
          <button className="btn-link" onClick={() => setMode("forgot")} style={{fontSize: '0.95rem'}}>Forgot Password</button>
        </div>
      </div>
      
      <div className="hero-image" style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #eef2ff 50%, #fef3c7 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(190, 24, 93, 0.1)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.08)'
        }}></div>
        
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fce7f3, #e0e7ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9 9"/>
              <path d="M12 21v-9"/>
              <circle cx="12" cy="9" r="5"/>
              <path d="M12 14v-2"/>
              <path d="M9 11h6"/>
            </svg>
          </div>
          <h2 style={{color: '#0f172a', fontSize: '1.5rem', marginBottom: '1rem'}}>Welcome to AI Pregnancy Care</h2>
          <p style={{color: '#64748b', lineHeight: '1.7', fontSize: '1rem'}}>
            Your personal pregnancy companion. Get AI-powered insights, track your health, 
            and receive expert guidance throughout your journey to motherhood.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: '#fce7f3',
              color: '#be185d',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>🤰 Pregnancy Tracking</span>
            <span style={{
              background: '#e0e7ff',
              color: '#7c3aed',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>🤖 AI Assistant</span>
            <span style={{
              background: '#fef3c7',
              color: '#b45309',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>💊 GDM Prediction</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#be185d'}}>24/7</div>
            <div style={{color: '#64748b', fontSize: '0.9rem'}}>AI Support</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#7c3aed'}}>100%</div>
            <div style={{color: '#64748b', fontSize: '0.9rem'}}>Private</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#059669'}}>Free</div>
            <div style={{color: '#64748b', fontSize: '0.9rem'}}>To Use</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;