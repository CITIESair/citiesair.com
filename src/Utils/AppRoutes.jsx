import { BLOG_CITIESair_URL } from "./GlobalVariables";

export const AppRoutes = {
  nyuad: "/dashboard/nyuad",
  nyuadMap: "/nyuadMap",
  nyuadBanner: "/nyuadBanner",
  allSensorsScreen: "/allSensorsScreen/:school_id_param/",
  login: "/login",
  signUp: "/signup",
  verify: "/verify",
  unsubscribeAlert: "/alerts/unsubscribe",
  googleCallback: "/google/callback",
  dashboard: "/dashboard",
  dashboardWithParam: "/dashboard/:school_id_param",
  home: "/",
  screenWithoutScreenID: "/screen/:school_id_param/",
  screenWithScreenID: "/screen/:school_id_param/:screen_id_param",
  404: "/404",
  blogSubdomain: BLOG_CITIESair_URL,
  redirectQuery: "redirect_url",
};
