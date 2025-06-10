import { getSession } from "../supabase/supabase.js";

export const requireAuth = async (req, res, next) => {
  const { session, error } = await getSession();

  if (error || !session) {
    return res.redirect("/login");
  }

  req.session = session;
  next();
};

export const redirectIfAuthenticated = async (req, res, next) => {
  const { session, error } = await getSession();

  if (session && !error) {
    return res.redirect("/home");
  }

  next();
};
