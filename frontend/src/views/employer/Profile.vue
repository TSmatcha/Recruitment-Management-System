<template>
    <EmployerLayout>
        <div class="p-8 bg-[#F8FAFC] min-h-screen font-sans">
            <div class="max-w-4xl mx-auto">

                <div class="mb-8">
                    <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Hồ sơ <span class="text-indigo-600">nhà tuyển dụng</span>
                    </h2>
                    <p class="text-slate-500 mt-2">Quản lý thông tin cá nhân và doanh nghiệp của bạn.</p>
                </div>

                <div v-if="loading && !formLoaded"
                    class="bg-white p-20 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                    <p class="text-slate-500 font-medium">Đang tải hồ sơ...</p>
                </div>

                <div v-else
                    class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    <form @submit.prevent="updateProfile" class="p-10 relative z-10">

                        <div class="mb-10">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Thông tin đại diện
                            </h3>
                           <!-- Avatar -->
                            <div class="flex items-center gap-6 mb-8">
                                <div class="relative">
                                    <img :src="avatarPreview || form.avatar || defaultAvatar"
                                        class="w-24 h-24 rounded-full object-cover border-4 border-indigo-100" />

                                    <label
                                        class="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 shadow-lg">
                                        <i class="fa-solid fa-camera text-sm"></i>
                                        <input type="file" accept="image/*" class="hidden"
                                            @change="handleAvatarChange" />
                                    </label>
                                </div>

                                <div>
                                    <p class="font-bold text-slate-800">Ảnh đại diện</p>
                                    <p class="text-sm text-slate-500">PNG, JPG • tối đa 2MB</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="label-pro">Tên người đại diện</label>
                                    <input v-model="form.name" disabled class="input-disabled-pro" />
                                </div>

                                <div class="space-y-2">
                                    <label class="label-pro">Địa chỉ Email</label>
                                    <input v-model="form.email" disabled class="input-disabled-pro" />
                                </div>

                                <div class="space-y-2">
                                    <label class="label-pro">Số điện thoại</label>
                                    <input v-model="form.phone" placeholder="Nhập số điện thoại..." class="input-pro" />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label class="label-pro">Ngày tham gia</label>
                                        <input v-model="form.joinDate" disabled
                                            class="input-disabled-pro text-center" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="label-pro">Lượt đăng tin</label>
                                        <div
                                            class="bg-indigo-50 text-indigo-700 font-black text-center py-3.5 rounded-2xl border border-indigo-100 text-sm">
                                            {{ form.credits }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-10 border-t border-slate-100 mb-10">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Thông tin doanh nghiệp
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="label-pro">Tên công ty</label>
                                    <input v-model="form.company.name" placeholder="Tên chính thức..."
                                        class="input-pro" />
                                </div>

                                <div class="space-y-2">
                                    <label class="label-pro">Website công ty</label>
                                    <input v-model="form.company.website" placeholder="congty.com" class="input-pro" />
                                </div>

                                <div class="space-y-2 md:col-span-2">
                                    <label class="label-pro">Địa chỉ trụ sở</label>
                                    <input v-model="form.company.address" placeholder="Địa chỉ chi tiết..."
                                        class="input-pro" />
                                </div>

                                <div class="space-y-2 md:col-span-2">
                                    <label class="label-pro">Giới thiệu về công ty</label>
                                    <textarea v-model="form.company.description" rows="5"
                                        placeholder="Mô tả ngắn gọn về doanh nghiệp của bạn..."
                                        class="input-pro resize-none py-4"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end pt-4">
                            <button type="submit" :disabled="loading"
                                class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-60">
                                {{ loading ? "Đang xử lý..." : "Cập nhật hồ sơ" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import EmployerLayout from "@/layouts/EmployerLayout.vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

const toast = useToast();
const auth = useAuthStore();

const loading = ref(false);
const formLoaded = ref(false);

/* ================= AVATAR ================= */
const avatarPreview = ref(null);

const defaultAvatar =
    "https://ui-avatars.com/api/?name=Employer&background=6366f1&color=fff";

/* ================= FORM ================= */
const form = ref({
    name: "",
    email: "",
    phone: "",
    avatar: null,
    credits: 0,
    joinDate: "",
    company: {
        name: "",
        address: "",
        website: "",
        description: "",
    },
});

/* ================= LOAD PROFILE ================= */
const loadProfile = async () => {
    loading.value = true;
    try {
        const { data } = await api.get("/employer/profile");

        Object.assign(form.value, {
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar || null, // 👈 QUAN TRỌNG
            credits: data.credits,
            joinDate: data.joinDate,
            company: {
                name: data.company?.name || "",
                address: data.company?.address || "",
                website: data.company?.website || "",
                description: data.company?.description || "",
            },
        });

        formLoaded.value = true;
    } catch (error) {
        toast.error("Không tải được hồ sơ nhà tuyển dụng");
    } finally {
        loading.value = false;
    }
};

/* ================= UPDATE PROFILE ================= */
const updateProfile = async () => {
    loading.value = true;
    try {
        const payload = {
            phone: form.value.phone,
            company: {
                name: form.value.company.name,
                address: form.value.company.address,
                website: form.value.company.website,
                description: form.value.company.description,
            },
        };

        await api.put("/employer/profile", payload);
        toast.success("Cập nhật hồ sơ thành công!");
        await loadProfile();
    } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ!");
    } finally {
        loading.value = false;
    }
};

/* ================= UPLOAD AVATAR ================= */
const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        toast.error("Ảnh tối đa 2MB");
        return;
    }

    avatarPreview.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const { data } = await api.put("/employer/profile/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Cập nhật avatar thành công");
        avatarPreview.value = null;

        // 🔹 Cập nhật store luôn
        auth.user.avatar = data.avatar; // giả sử API trả về avatar mới
        await loadProfile();
    } catch (err) {
        toast.error("Upload avatar thất bại");
        avatarPreview.value = null;
    }
};

/* ================= INIT ================= */
onMounted(async () => {
    if (!auth.token) await auth.fetchUser();
    await loadProfile();
});
</script>


<style scoped>
.label-pro {
    @apply block text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-2;
}

.input-pro {
    @apply w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-700 font-medium placeholder:text-slate-300 outline-none text-sm;
}

.input-disabled-pro {
    @apply w-full bg-slate-100/50 border-none rounded-2xl px-5 py-3.5 text-slate-400 cursor-not-allowed font-medium text-sm;
}

textarea::-webkit-scrollbar {
    width: 4px;
}

textarea::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>