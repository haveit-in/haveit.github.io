import { RecaptchaVerifier, GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "../firebase";

// Test Firebase configuration
export const testFirebaseConfig = () => {
  const auth = getAuth();
  console.log("=== FIREBASE CONFIG TEST ===");
  console.log("Auth app:", auth.app);
  console.log("Project ID:", auth.app.options.projectId);
  console.log("App ID:", auth.app.options.appId);
  console.log("API Key:", auth.app.options.apiKey);
  console.log("Auth Domain:", auth.app.options.authDomain);
  return auth.app.options.projectId;
};

// reCAPTCHA setup for OTP
export const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }
  
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible"
    },
    auth
  );
  
  return window.recaptchaVerifier;
};

/** Shared Google popup → Firebase ID token → backend exchange (all roles). */
async function loginWithGoogleRole(loginCallback, role = "user", { forceRefresh = false } = {}) {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);

  const user = auth.currentUser;
  if (!user) {
    throw new Error("Google sign-in did not return a user");
  }

  const token = await user.getIdToken(forceRefresh);
  if (token.split(".").length !== 3) {
    throw new Error("Invalid Firebase ID token format");
  }

  if (loginCallback) {
    return await loginCallback(token, role);
  }

  return { user: { email: user.email, name: user.displayName } };
}

export const loginWithGoogle = (loginCallback) =>
  loginWithGoogleRole(loginCallback, "user");

export const loginWithGooglePartner = (loginCallback) =>
  loginWithGoogleRole(loginCallback, "partner");

export const loginWithGoogleAdmin = (loginCallback) =>
  loginWithGoogleRole(loginCallback, "admin", { forceRefresh: true });
