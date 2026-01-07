<template>
    <footer class="bg-[#0a0f24] text-gray-300 py-10 mt-16">
        <div class="container mx-auto px-6 grid md:grid-cols-4 gap-8">
            <!-- Cột 1: Logo & mô tả -->
            <div>
                <div class="flex items-center space-x-2 mb-3">
                    <img src="/logo.png" alt="Logo" class="w-10 h-10 rounded-full ring-2 ring-indigo-500" />
                    <span class="text-white font-bold text-lg">JobLink</span>
                </div>
                <p class="text-sm leading-relaxed">
                    Nền tảng kết nối nhà tuyển dụng và ứng viên chuyên nghiệp.
                    Giúp bạn tìm việc nhanh chóng và tuyển dụng hiệu quả.
                </p>
            </div>

            <!-- Cột 2: Liên kết nhanh -->
            <div>
                <h3 class="text-white font-semibold text-lg mb-4">Liên kết nhanh</h3>
                <ul class="space-y-2 text-sm">
                    <li>
                        <RouterLink to="/" class="hover:text-indigo-400 transition">Trang chủ</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/jobs" class="hover:text-indigo-400 transition">Tìm việc</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/companies" class="hover:text-indigo-400 transition">Công ty</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/contact" class="hover:text-indigo-400 transition">Liên hệ</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Cột 3: Dành cho người dùng -->
           <!-- Cột 3: Ngành nghề -->
            <div>
                <h3 class="text-white font-semibold text-lg mb-4">Ngành nghề</h3>
                <ul class="space-y-2 text-sm">
                    <li>
                        <RouterLink to="/jobs/search?career=it" class="hover:text-indigo-400 transition">Công nghệ thông tin
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/jobs/search?career=marketing" class="hover:text-indigo-400 transition">Marketing</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/jobs/search?career=sales" class="hover:text-indigo-400 transition">Bán hàng</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/jobs/search?career=hr" class="hover:text-indigo-400 transition">Nhân sự</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Cột 4: Liên hệ -->
            <div>
                <h3 class="text-white font-semibold text-lg mb-4">Liên hệ</h3>
                <ul class="space-y-2 text-sm">
                    <li>📍 168 Nguyễn Văn Cừ, Ninh Kiều, TP. Cần Thơ</li>
                    <li>📞 0373 901 123</li>
                    <li>✉️ contact@joblink.vn</li>
                </ul>
            </div>
        </div>

        <!-- Dòng bản quyền -->
        <div class="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
            © 2025 JobLink
        </div>
    </footer>
</template>

<script setup>
</script>
