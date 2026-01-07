import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Đọc user từ sessionStorage (biến mất khi tắt tab)
    user: (() => {
      try {
        return JSON.parse(sessionStorage.getItem("user") || "null");
      } catch (e) {
        return null;
      }
    })(),
    token: sessionStorage.getItem("token") || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    setUser(user) {
      this.user = user;
      sessionStorage.setItem("user", JSON.stringify(user));
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        // Thử lấy profile tùy theo role hiện tại
        const endpoint = this.userRole === "employer" ? "/employer/profile" : "/candidate/profile";
        const res = await api.get(endpoint);
        this.setUser({ ...res.data, role: this.userRole });
      } catch {
        this.logout();
      }
    },

    async login(email, password) {
      try {
        const { data } = await api.post("/auth/login", { email, password });
        
        this.user = { ...data.user, role: data.user.role || "candidate" };
        this.token = data.token;

        // Lưu vào sessionStorage để tách biệt giữa các tab
        sessionStorage.setItem("user", JSON.stringify(this.user));
        sessionStorage.setItem("token", this.token);

        return data;
      } catch (error) {
        throw error.response?.data?.message || "Đăng nhập thất bại";
      }
    },

    async registerCandidate(name, email, password) {
      try {
        const { data } = await api.post("/auth/register-candidate", { name, email, password });
        this.user = { ...data.user, role: "candidate" };
        this.token = data.token;
        sessionStorage.setItem("user", JSON.stringify(this.user));
        sessionStorage.setItem("token", this.token);
        return data;
      } catch (error) {
        throw error.response?.data?.message || "Đăng ký thất bại";
      }
    },

    async registerEmployer(name, email, password) {
      try {
        const { data } = await api.post("/auth/register-employer", { name, email, password });
        this.user = { ...data.user, role: "employer" };
        this.token = data.token;
        sessionStorage.setItem("user", JSON.stringify(this.user));
        sessionStorage.setItem("token", this.token);
        return data;
      } catch (error) {
        throw error.response?.data?.message || "Đăng ký thất bại";
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      // Reload lại trang để xóa sạch header cũ nếu cần
      window.location.href = "/login";
    }
  },
});