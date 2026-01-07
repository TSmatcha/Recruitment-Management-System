<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">
        <!-- Navbar -->
        <nav class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <RouterLink to="/" class="text-indigo-600 font-bold text-xl hover:opacity-80 transition">JobLink
            </RouterLink>

            <div class="flex items-center space-x-4">
                <template v-if="currentUser">
                    <span class="text-gray-700 font-semibold">{{ currentUser.name }}</span>
                    <button @click="logout" :disabled="isLoggingOut"
                        class="flex items-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-1.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-60">
                        <i class="fa-solid fa-right-from-bracket text-gray-600"></i>
                        <span>{{ isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất' }}</span>
                    </button>
                </template>
                <template v-else>
                    <RouterLink to="/login" class="text-gray-700 font-medium hover:text-indigo-600 transition">Login
                    </RouterLink>
                    <RouterLink to="/register" class="text-gray-700 font-medium hover:text-indigo-600 transition">
                        Register</RouterLink>
                </template>
            </div>
        </nav>

        <!-- Nội dung chính -->
        <main class="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-indigo-600 mb-4">Liên hệ với chúng tôi</h1>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Nếu bạn có thắc mắc, góp ý hoặc cần hỗ trợ, vui lòng liên hệ qua thông tin dưới đây
                    hoặc gửi tin nhắn trực tiếp cho chúng tôi. Đội ngũ <strong>JobLink</strong> sẽ phản hồi sớm nhất có
                    thể!
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-10 items-start">
                <!-- Thông tin liên hệ -->
                <div class="bg-white p-8 rounded-2xl shadow border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-indigo-500 mb-4">Thông tin liên hệ</h2>
                        <ul class="space-y-3 text-gray-700">
                            <li>📧 Email: <a href="mailto:support@joblink.vn"
                                    class="text-indigo-600 hover:underline"> contact@joblink.vn</a></li>
                            <li>📞 Hotline: <span class="font-medium">0373 901 123</span></li>
                            <li>📍 Địa chỉ: 168 Nguyễn Văn Cừ, Quận Ninh Kiều, TP. Cần Thơ</li>
                        </ul>
                    </div>

                    <div class="mt-6">
                        <iframe class="w-full h-56 rounded-lg border"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.739565330648!2d105.77025767456592!3d10.032384672697975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089e6c8f64f03%3A0x622f47b8b869f2e3!2zTmfDtG4gSMOyYSDEkOG6t25n!5e0!3m2!1svi!2s!4v1696852100000!5m2!1svi!2s"
                            allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>

                <!-- Form liên hệ -->
                <form @submit.prevent="sendMessage"
                    class="bg-white p-8 rounded-2xl shadow border border-gray-200 flex flex-col">
                    <h2 class="text-2xl font-semibold text-indigo-500 mb-6">Gửi phản hồi</h2>

                    <div class="mb-4">
                        <label class="block text-gray-700 mb-1 font-medium">Họ và tên</label>
                        <input v-model="form.name" type="text" placeholder="Nhập họ và tên..."
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                            required />
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 mb-1 font-medium">Email</label>
                        <input v-model="form.email" type="email" placeholder="Nhập email..."
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                            required />
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 mb-1 font-medium">Nội dung</label>
                        <textarea v-model="form.message" rows="5" placeholder="Nhập nội dung tin nhắn..."
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                            required></textarea>
                    </div>

                    <button type="submit"
                        class="mt-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition">
                        Gửi phản hồi
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const currentUser = computed(() => auth.user);
const isLoggingOut = ref(false);

const logout = () => {
    isLoggingOut.value = true;
    toast.info("Đang đăng xuất...", { timeout: 1000 });

    setTimeout(() => {
        auth.logout();
        toast.success("Đăng xuất thành công!");
        router.push("/employer/login");
        isLoggingOut.value = false;
    }, 1200);
};

// Form liên hệ
const form = reactive({
    name: "",
    email: "",
    message: "",
});

function sendMessage() {
    toast.success(`Cảm ơn ${form.name}! Tin nhắn đã được gửi.`);
    form.name = "";
    form.email = "";
    form.message = "";
}
</script>
