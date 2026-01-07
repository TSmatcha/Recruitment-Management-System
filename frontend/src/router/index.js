import { createRouter, createWebHistory } from "vue-router";

// Public
import Home from "../views/Home.vue";
import HomeEmployer from "../views/HomeEmployer.vue";
import Jobs from "../views/Jobs.vue";
import JobDetail from "../views/JobDetail.vue";
import CompanyDetail from "../views/CompanyDetail.vue";
import Companies from "../views/Companies.vue";
import Contact from "../views/Contact.vue";

// Candidate
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import CandidateDashboard from "../views/candidate/Dashboard.vue";
import CandidateProfile from "../views/candidate/Profile.vue";
import Applications from "../views/candidate/Applications.vue";
import SavedJobs from "../views/candidate/SavedJobs.vue";

// Employer
import EmployerLogin from "../views/EmployerLogin.vue";
import EmployerRegister from "../views/EmployerRegister.vue";
import EmployerDashboard from "../views/employer/Dashboard.vue";

// Admin
import AdminLogin from "../views/admin/AdminLogin.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminJobs from "../views/admin/AdminJobs.vue";
import AdminCompanies from "../views/admin/AdminCompanies.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminApplications from "../views/admin/AdminApplications.vue";

const routes = [
  // Employer Auth
  { path: "/employer/login", component: EmployerLogin },
  { path: "/employer/register", component: EmployerRegister },

  // Public
  { path: "/", component: Home },
  { path: "/employer", component: HomeEmployer },
  { path: "/jobs", component: Jobs },
  { path: "/job/:id", component: JobDetail },
  { path: "/companies", component: Companies },
  { path: "/company/:id", component: CompanyDetail },
  { path: "/contact", component: Contact },

  // Candidate
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:token", component: ResetPassword },


  {
    path: "/candidate/dashboard",
    component: CandidateDashboard,
    meta: { requiresAuth: true, role: "candidate" },
  },
  {
    path: "/candidate/profile",
    component: CandidateProfile,
    meta: { requiresAuth: true, role: "candidate" },
  },
  {
    path: "/candidate/profile/edit",
    component: () => import("../views/candidate/ProfileEdit.vue"),
    meta: { requiresAuth: true, role: "candidate" },
  },
  // Candidate – mới
{
  path: "/candidate/profile/viewed",
  component: () => import("../views/candidate/Viewed.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},
{
  path: "/candidate/notifications",
  component: () => import("../views/candidate/Notifications.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},

  {
    path: "/candidate/change-password",
    component: () => import("../views/candidate/ChangePassword.vue"),
    meta: { requiresAuth: true, role: "candidate" },
  },
  {
  path: "/candidate/applied-jobs",
  component: () => import("../views/candidate/Applications.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},

  {
    path: "/candidate/saved-jobs",
    component: SavedJobs,
    meta: { requiresAuth: true, role: "candidate" },
  },
{
  path: "/candidate/create-cv",
  name: "CreateCV",
  component: () => import("../views/candidate/CreateCV.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},
{
  path: "/candidate/cvs",
  name: "CandidateCVList",
  component: () => import("../views/candidate/CVList.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},
{
  path: "/candidate/cv/edit/:id",
  name: "EditCV",
  component: () => import("../views/candidate/EditCV.vue"),
   meta: { requiresAuth: true, role: "candidate" },
},
{
  path: "/candidate/cv/:id",
  name: "CandidateCVDetail",
  component: () => import("../views/candidate/CVDetail.vue"),
   meta: { requiresAuth: true, role: "candidate" },
},
{
  path: "/candidate/employer/:id",
  name: "EmployerDetail",
  component: () => import("../views/candidate/EmployerDetail.vue"),
  meta: { requiresAuth: true, role: "candidate" },
},
  {
  path: "/candidate/invitations",
  name: "CandidateInvitations",
  component: () => import("../views/candidate/CandidateInvitations.vue"), // Đường dẫn tới file bạn đã tạo
  meta: { requiresAuth: true, role: 'candidate' }
},

  // Search
  { path: "/jobs/search", component: () => import("../views/Search.vue") },

  // Employer dashboard
  {
    path: "/employer/dashboard",
    component: EmployerDashboard,
    meta: { requiresAuth: true, role: "employer" },
  },
 {
  path: "/employer/talents",
  name: "EmployerTalents",
  component: () => import("../views/employer/TalentSearch.vue"),
  meta: { requiresAuth: true, role: "employer" },
},

  {
    path: "/employer/post-job/:id?",
    name: "EmployerPostJob",
    component: () => import("../views/employer/PostJob.vue"),
    meta: { requiresAuth: true, role: "employer" },
  },
  {
    path: "/employer/jobs",
    name: "EmployerJobs",
    component: () => import("../views/employer/JobsList.vue"),
    meta: { requiresAuth: true, role: "employer" },
  },
  {
    path: "/employer/applicants",
    component: () => import("../views/employer/Applicants.vue"),
    meta: { requiresAuth: true, role: "employer" },
  },
  {
    path: "/employer/profile",
    component: () => import("../views/employer/Profile.vue"),
    meta: { requiresAuth: true, role: "employer" },
  },
  {
    path: "/employer/change-password",
    component: () => import("../views/employer/ChangePassword.vue"),
    meta: { requiresAuth: true, role: "employer" },
  },
  {
  path: '/employer/applicant/:id',
  name: 'ApplicantDetail',
  component: () => import('../views/employer/ApplicantDetail.vue')
},
  {
  path: "/employer/talents/:id",
  name: "EmployerCandidateDetail",
  component: () => import("@/views/employer/CandidateDetail.vue"),
  meta: { requiresAuth: true, role: "employer" },
},
  {
  path: "/employer/saved-candidates",
  name: "SavedCandidates",
  component: () => import("../views/employer/SavedCandidates.vue"),
  meta: { requiresAuth: true, role: "employer" },
},
{
  path: "/employer/notifications",
  name: "EmployerNotifications",
  component: () => import("../views/employer/Notifications.vue"),
  meta: { requiresAuth: true, role: "employer" },
},
{
    path: '/employer/cv/:id',
    name: 'EmployerCVView',
    component: () => import('../views/employer/ViewSystemCV.vue'),
    meta: { requiresAuth: true, role: 'employer' }
},
  // Admin
  { path: "/admin/login", component: AdminLogin },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/users",
    component: AdminUsers,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/companies",
    component: AdminCompanies,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/jobs",
    component: AdminJobs,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/jobs/:id",
    component: () => import("../views/admin/AdminJobDetail.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/applications",
    component: AdminApplications,
    meta: { requiresAuth: true, role: "admin" },
  },

  { path: "/admin", redirect: "/admin/dashboard" },
  {
   path: '/admin/companies/:id',
   name: 'AdminCompanyDetail',
   component: () => import('@/views/admin/AdminCompanyDetail.vue'),
   meta: { requiresAuth: true, role: 'admin' },
 },

  // 404
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard
router.beforeEach((to, from, next) => {
  // Đọc từ sessionStorage để mỗi tab có một phiên làm việc riêng biệt
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const loggedIn = !!user;
  const role = user?.role;

  const authPages = [
    "/login",
    "/register",
    "/employer/login",
    "/employer/register",
    "/admin/login",
  ];

  // 1. Nếu đã login mà cố vào các trang login/register -> Chuyển về Dashboard tương ứng
  if (authPages.includes(to.path) && loggedIn) {
    if (role === "candidate") return next("/candidate/dashboard");
    if (role === "employer") return next("/employer/dashboard");
    if (role === "admin") return next("/admin/dashboard");
  }

  // 2. Nếu là trang công khai (không yêu cầu requiresAuth)
  if (!to.meta.requiresAuth) {
    return next();
  }

  // 3. Nếu chưa đăng nhập mà truy cập trang bảo mật
  if (!loggedIn) {
    if (to.path.startsWith("/admin")) return next("/admin/login");
    if (to.path.startsWith("/employer")) return next("/employer/login");
    return next("/login");
  }

  // 4. Nếu sai Role -> Chuyển về Dashboard đúng của Role đó
  if (to.meta.role && role !== to.meta.role) {
    const targetDashboard = role === "admin" ? "/admin/dashboard" : 
                           role === "employer" ? "/employer/dashboard" : 
                           "/candidate/dashboard";
    return next(targetDashboard);
  }

  next();
});

export default router;
