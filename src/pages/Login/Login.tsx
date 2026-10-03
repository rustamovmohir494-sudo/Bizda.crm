import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  ShoppingCart,
  Package,
  Tag,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const from =
    (
      location.state as {
        from?: {
          pathname?: string;
        };
      } | null
    )?.from?.pathname ?? "/";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError("Email kiriting.");
      return;
    }

    if (!cleanPassword) {
      setError("Password kiriting.");
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * Backendga faqat:
       *
       * email
       * password
       *
       * yuboriladi.
       */
      await login(
        cleanEmail,
        cleanPassword,
      );

      /*
       * Login muvaffaqiyatli bo'lsa,
       * oldingi sahifaga qaytamiz.
       */
      navigate(from, {
        replace: true,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login qilishda xatolik yuz berdi.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      {/* =========================
          LEFT SIDE
      ========================== */}

      <section className="login-left">
        <div className="login-content">

          <div className="login-logo">
            DEAL<span>PORT</span>
          </div>

          <div className="login-heading">
            <p className="login-label">
              Welcome back
            </p>

            <h1>
              Login to your account
            </h1>

            <p className="login-description">
              Manage your store, products,
              orders and customers from one
              place.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}

            <label className="form-label">
              Email

              <div className="input-container">
                <Mail size={19} />

                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </label>

            {/* PASSWORD */}

            <label className="form-label">
              Password

              <div className="input-container">
                <LockKeyhole size={19} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  placeholder="Enter your password"
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </label>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                <span>⚠️</span>

                <p>{error}</p>
              </div>
            )}

            {/* BUTTON */}

            <button
              className="login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-loader" />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-security">
            <LockKeyhole size={14} />

            <span>
              Your connection is secure
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          RIGHT SIDE
      ========================== */}

      <section className="login-visual">
        <div className="visual-background-circle circle-one" />
        <div className="visual-background-circle circle-two" />

        <div className="visual-content">

          <div className="visual-title">
            <span>
              SMARTER STORE
            </span>

            <h2>
              Everything you need
              <br />
              to grow your store.
            </h2>

            <p>
              Products, orders, customers
              and sales — all in one place.
            </p>
          </div>

          {/* CENTER SHOP */}

          <div className="store-animation">

            <div className="store-circle">
              <ShoppingBag size={76} />
            </div>

            <div className="floating-card card-package">
              <Package size={24} />

              <div>
                <strong>
                  Products
                </strong>

                <span>
                  Manage inventory
                </span>
              </div>
            </div>

            <div className="floating-card card-order">
              <ShoppingCart size={24} />

              <div>
                <strong>
                  Orders
                </strong>

                <span>
                  New order received
                </span>
              </div>
            </div>

            <div className="floating-card card-sale">
              <TrendingUp size={24} />

              <div>
                <strong>
                  Sales
                </strong>

                <span>
                  Growing every day
                </span>
              </div>
            </div>

            <div className="floating-card card-discount">
              <Tag size={22} />

              <span>
                -25%
              </span>
            </div>

            {/* ORBIT DOTS */}

            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="orbit-dot dot-three" />
            <span className="orbit-dot dot-four" />
          </div>

          <div className="visual-bottom">
            <span />

            <p>
              Your store. Your data. Your growth.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

