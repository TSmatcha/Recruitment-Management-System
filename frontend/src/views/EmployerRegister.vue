<template>
  <div class="min-h-screen bg-[#F0F2F5] flex justify-center items-center py-12 px-4 font-sans">
    <div
      class="w-full max-w-6xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-slate-100">

      <div class="w-full md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div
            class="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 class="text-3xl font-black leading-tight tracking-tighter">
            GIA NHẬP <br />MẠNG LƯỚI <br />TUYỂN DỤNG
          </h2>
          <p class="text-slate-400 mt-4 text-sm font-medium leading-relaxed">
            Kết nối với hàng nghìn ứng viên tiềm năng và xây dựng đội ngũ trong mơ của bạn.
          </p>
        </div>

        <div class="relative z-10 pt-10 border-t border-slate-800">
          <p class="text-xs text-slate-500 uppercase tracking-widest font-bold">Đối tác tin cậy</p>
          <div class="flex gap-4 mt-4 grayscale opacity-50">
            <div class="h-6 w-12 bg-slate-700 rounded"></div>
            <div class="h-6 w-12 bg-slate-700 rounded"></div>
            <div class="h-6 w-12 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-2/3 p-8 lg:p-14 bg-white">
        <form @submit.prevent="handleRegister" class="space-y-8">

          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="h-1 w-8 bg-blue-600 rounded-full"></div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Thông tin tài khoản</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Họ và tên *</label>
                <input v-model="form.fullName" type="text" placeholder="Nhập họ tên"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium"
                  required />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Số điện thoại
                  *</label>
                <input v-model="form.phone" type="text" placeholder="Nhập SĐT"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium"
                  required />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email cá nhân
                  *</label>
                <input v-model="form.email" type="email" placeholder="email@example.com"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium"
                  required />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Mật khẩu *</label>
                <div class="relative">
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="••••••••"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium"
                    required />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                    <i :class="showPassword ? 'fas fa-eye-slash text-xs' : 'fas fa-eye text-xs'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="h-1 w-8 bg-blue-600 rounded-full"></div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Thông tin công ty</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2 space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Tên công ty *</label>
                <input v-model="form.companyName" type="text" placeholder="CÔNG TY CỔ PHẦN..."
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-bold"
                  required />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Địa điểm *</label>
                <select v-model="form.location"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  required>
                  <option value="">Chọn tỉnh / thành phố</option>
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                  <option>Hải Phòng</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                  <option>Huế</option>
                  <option>Lai Châu</option>
                  <option>Điện Biên</option>
                  <option>Sơn La</option>
                  <option>Lạng Sơn</option>
                  <option>Cao Bằng</option>
                  <option>Tuyên Quang</option>
                  <option>Lào Cai</option>
                  <option>Thái Nguyên</option>
                  <option>Phú Thọ</option>
                  <option>Bắc Ninh</option>
                  <option>Hưng Yên</option>
                  <option>Ninh Bình</option>
                  <option>Quảng Ninh</option>
                  <option>Thanh Hóa</option>
                  <option>Nghệ An</option>
                  <option>Hà Tĩnh</option>
                  <option>Quảng Trị</option>
                  <option>Quảng Ngãi</option>
                  <option>Gia Lai</option>
                  <option>Khánh Hòa</option>
                  <option>Lâm Đồng</option>
                  <option>Đắk Lắk</option>
                  <option>Đồng Nai</option>
                  <option>Tây Ninh</option>
                  <option>Vĩnh Long</option>
                  <option>Đồng Tháp</option>
                  <option>An Giang</option>
                  <option>Cà Mau</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Lĩnh vực hoạt động
                  *</label>
                <select v-model="form.industry"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  required>
                  <option value="">Chọn lĩnh vực</option>
                  <option> IT </option>
                  <option> Bán hàng </option>
                  <option> Kế toán - Tài chính </option>
                  <option> Marketing </option>
                  <option> Giáo dục </option>
                  <option> Nhân sự </option>
                  <option> Y tế </option>
                  <option> Sản xuất </option>
                  <option> Khác </option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Website</label>
                <input v-model="form.website" type="text" placeholder="https://..."
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email công ty</label>
                <input v-model="form.companyEmail" type="email" placeholder="hr@abc.com"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium" />
              </div>

              <div class="md:col-span-2 space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Giới thiệu
                  ngắn</label>
                <textarea v-model="form.description" placeholder="Vài nét về quy mô và văn hóa công ty..." rows="2"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-sm font-medium resize-none"></textarea>
              </div>
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p class="text-xs text-slate-500 font-bold">
              Đã có tài khoản?
              <router-link to="/employer/login"
                class="text-blue-600 hover:text-slate-900 ml-1 transition-colors underline decoration-blue-200 underline-offset-4">Đăng
                nhập</router-link>
            </p>
            <button type="submit"
              class="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase text-[11px] tracking-[0.2em]">
              Đăng ký tài khoản
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";

const router = useRouter();
const showPassword = ref(false);
const loading = ref(false); // Thêm biến loading để chặn click liên tục

const form = reactive({
  fullName: "", phone: "", email: "", password: "",
  companyName: "", location: "", industry: "",
  description: "", website: "", companyEmail: "", logo: "",
});

const handleRegister = async () => {
  try {
    loading.value = true;
    const res = await api.post("/auth/register-employer", {
      name: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      companyName: form.companyName,
      location: form.location,
      industry: form.industry,
      description: form.description,
      website: form.website,
      emailCompany: form.companyEmail,
      logo: form.logo,
    });

    alert(res.data.message || "Đăng ký tài khoản nhà tuyển dụng thành công!");

    // Sau khi đăng ký, điều hướng về login để người dùng tạo Session tại tab đó
    router.push("/employer/login");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Đăng ký thất bại!");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.1em;
}
</style>