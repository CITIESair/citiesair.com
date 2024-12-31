import { BLOG_CITIESair_URL } from "./GlobalVariables";

export const AppRoutes = {
  nyuad: "/dashboard/nyuad",
  nyuadMap: "/nyuadMap",
  nyuadBanner: "/nyuadBanner",
  login: "/login",
  signUp: "/signup",
  verify: "/verify",
  googleCallback: "/google/callback",
  dashboard: "/dashboard",
  dashboardWithParam: "/dashboard/:school_id_param",
  home: "/",
  anyScreen: "/screen/*",
  404: "/404",
  blogSubdomain: BLOG_CITIESair_URL,
  redirectQuery: "redirect_url",
};
