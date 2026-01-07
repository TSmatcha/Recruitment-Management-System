<template>
    <div class="flex min-h-screen w-full bg-white font-sans">

        <div class="hidden lg:block lg:w-1/2 relative">
            <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1500&auto=format&fit=crop"
                alt="Office Setup" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute inset-0 bg-slate-900/30"></div>

            <div class="absolute bottom-16 left-16 max-w-sm">
                <div class="flex items-center gap-3 mb-6">
                    <div
                        class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                        <span class="text-white font-black text-2xl">J</span>
                    </div>
                    <span class="text-white font-bold text-3xl tracking-tight">JobLink</span>
                </div>
                <p class="text-white/90 text-lg font-medium leading-relaxed">
                    Nâng tầm sự nghiệp của bạn với những cơ hội tốt nhất từ các đối tác hàng đầu.
                </p>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
            <div class="w-full max-w-md">

                <div class="mb-12">
                    <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight">Đăng ký ngay</h2>
                    <p class="text-slate-500 mt-3 font-medium text-lg italic">"Cánh cửa mới đang chờ đón bạn"</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-6">
                    <div class="group">
                        <label
                            class="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600">
                            Họ và tên
                        </label>
                        <input v-model="form.name" type="text" placeholder="Nhập họ và tên"
                            class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-300 placeholder-slate-300 text-slate-700"
                            required />
                    </div>

                    <div class="group">
                        <label
                            class="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600">
                            Email
                        </label>
                        <input v-model="form.email" type="email" placeholder="example@gmail.com"
                            class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-300 placeholder-slate-300 text-slate-700"
                            required />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="group">
                            <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Mật khẩu</label>
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                                    placeholder="••••••••"
                                    class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                    required />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                            </div>
                        </div>

                        <div class="group">
                            <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Xác nhận</label>
                            <input v-model="form.confirmPassword" type="password" placeholder="••••••••"
                                class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                required />
                        </div>
                    </div>

                    <transition name="fade">
                        <div v-if="errorMessage"
                            class="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-center gap-2">
                            <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
                        </div>
                    </transition>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white font-extrabold py-4 rounded-2xl hover:bg-blue-700 transform transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 mt-4 text-lg"
                        :disabled="loading">
                        {{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay' }}
                    </button>
                </form>

                <div class="mt-12 text-center">
                    <p class="text-slate-500 font-medium">
                        Bạn đã có tài khoản rồi?
                        <router-link to="/login"
                            class="text-blue-600 font-bold ml-1 hover:text-blue-800 transition-colors border-b-2 border-transparent hover:border-blue-800 pb-0.5">
                            Đăng nhập
                        </router-link>
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const handleRegister = async () => {
    // 1. Kiểm tra mật khẩu khớp
    if (form.password !== form.confirmPassword) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!'
        return
    }

    try {
        loading.value = true
        errorMessage.value = ''

        // 2. Gửi request đăng ký
        // LƯU Ý: Thêm industry: 'none' để thỏa mãn validation của Backend
        const { data } = await api.post('/auth/register-candidate', {
            name: form.name,
            email: form.email,
            password: form.password,
            industry: 'none' // Gửi giá trị mặc định để bypass lỗi "required"
        })

        alert(data.message || "Đăng ký tài khoản thành công!")

        // 3. Chuyển hướng về trang login
        router.push('/login')
    } catch (err) {
        // In ra console để debug nếu vẫn lỗi
        console.error("Lỗi đăng ký:", err.response?.data);
        errorMessage.value = err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!'
    } finally {
        loading.value = false
    }
}
</script>