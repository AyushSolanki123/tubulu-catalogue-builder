const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/Home.vue"),
      },
      {
        path: "/assignment",
        component: () => import("pages/Assignment.vue"),
      },
      {
        path: "/admin",
        component: () => import("pages/Admin.vue"),
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/Auth.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
