import { getSession } from "../supabase/supabase.js";

export const requireAuth = async (req, res, next) => {
  try {
    const { session, error } = await getSession();

    if (error || !session) {
      return res.redirect("/login");
    }

    req.session = session;
    next();
  } catch (error) {
    console.error("requireAuth middleware error:", error);
    return res.redirect("/login");
  }
};

export const redirectIfAuthenticated = async (req, res, next) => {
  try {
    const { session, error } = await getSession();

    if (session && !error) {
      return res.redirect("/home");
    }

    next();
  } catch (error) {
    console.error("redirectIfAuthenticated middleware error:", error);
    // Continue to the next middleware/route even if there's an error
    next();
  }
};
