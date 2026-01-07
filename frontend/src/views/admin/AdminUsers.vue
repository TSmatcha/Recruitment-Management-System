<template>
    <AdminLayout pageTitle="Người dùng">
        <div class="space-y-12 animate-fade-in">

            <div
                class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-slate-900">
                <div>
                    <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Quản trị <span class="text-slate-400">Người dùng</span>
                    </h1>
                    <p
                        class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                        Kiểm soát quyền truy cập toàn hệ thống
                    </p>
                </div>

                <div class="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
                    <div class="relative flex-1 md:w-64">
                        <input v-model="search" type="text" placeholder="TÌM TÊN HOẶC EMAIL..."
                            class="w-full bg-white border border-slate-200 rounded-sm px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:border-slate-900 transition-all outline-none shadow-sm" />
                    </div>

                    <select v-model="roleFilter"
                        class="bg-white border border-slate-200 rounded-sm px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:border-slate-900 transition-all outline-none cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ5N2IxIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat shadow-sm">
                        <option value="">Tất cả vai trò</option>
                        <option value="candidate">Ứng viên</option>
                        <option value="employer">Nhà tuyển dụng</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[400px]">
                <table class="min-w-full border-collapse text-left">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và
                                tên</th>
                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên
                                hệ</th>
                            <th
                                class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                Vai trò</th>
                            <th
                                class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                Tình trạng</th>
                            <th
                                class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="loading">
                            <td colspan="5" class="p-20 text-center">
                                <span
                                    class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">Đang
                                    đồng bộ dữ liệu...</span>
                            </td>
                        </tr>

                        <tr v-for="u in filteredUsers" :key="u._id" class="hover:bg-slate-50 transition-colors group">
                            <td
                                class="px-6 py-6 text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                                {{ u.name }}
                            </td>
                            <td class="px-6 py-6 text-xs font-bold text-slate-500 italic tracking-tight">
                                {{ u.email }}
                            </td>
                            <td class="px-6 py-6 text-center">
                                <span
                                    class="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-3 py-1 rounded-md bg-white">
                                    {{ u.role }}
                                </span>
                            </td>
                            <td class="px-6 py-6 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <div class="w-1.5 h-1.5 rounded-full"
                                        :class="u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'">
                                    </div>
                                    <span class="text-[9px] font-black uppercase tracking-widest"
                                        :class="u.isActive ? 'text-emerald-600' : 'text-rose-600'">
                                        {{ u.isActive ? 'Hoạt động' : 'Đã khóa' }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-6 text-right">
                                <div
                                    class="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button @click="toggleActive(u)" class="action-btn"
                                        :class="u.isActive ? 'border-rose-100 text-rose-400 hover:border-rose-600 hover:text-rose-600' : 'border-emerald-100 text-emerald-400 hover:border-emerald-600 hover:text-emerald-600'">
                                        {{ u.isActive ? 'Khóa' : 'Mở khóa' }}
                                    </button>
                                    <button @click="confirmDelete(u)"
                                        class="action-btn border-slate-100 text-slate-300 hover:border-slate-900 hover:text-slate-900">
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="!loading && filteredUsers.length === 0">
                            <td colspan="5"
                                class="p-20 text-center italic text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                Không tìm thấy dữ liệu phù hợp
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="toDelete"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div
                    class="bg-white border border-slate-200 p-10 rounded-sm shadow-2xl max-w-sm w-full animate-fade-in text-center">
                    <h3
                        class="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-slate-900 underline underline-offset-8 decoration-rose-500">
                        Xác nhận xóa</h3>
                    <p class="text-xs font-bold text-slate-400 mb-10 leading-relaxed uppercase">
                        Hành động này không thể hoàn tác đối với: <br>
                        <span class="text-slate-900 font-black tracking-tight block mt-2">{{ toDelete.name }}</span>
                    </p>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="toDelete = null"
                            class="action-btn py-3 border-slate-200 text-slate-400 hover:text-slate-900">Hủy bỏ</button>
                        <button @click="remove"
                            class="action-btn py-3 bg-slate-900 text-white border-slate-900 hover:bg-rose-600">Xóa vĩnh
                            viễn</button>
                    </div>
                </div>
            </div>

            <div class="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-2 pt-8">
                <span>Tổng số bản ghi: {{ filteredUsers.length }}</span>
                <span>Hệ thống quản trị an toàn</span>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const users = ref([]);
const loading = ref(false);
const search = ref("");
const roleFilter = ref("");
const toDelete = ref(null);

const load = async () => {
    loading.value = true;
    try {
        const res = await api.get("/admin/users");
        users.value = res.data || [];
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const filteredUsers = computed(() => {
    return users.value.filter((u) => {
        const name = u.name ? u.name.toLowerCase() : "";
        const email = u.email ? u.email.toLowerCase() : "";
        const s = search.value.toLowerCase();

        const matchSearch = name.includes(s) || email.includes(s);
        const matchRole = roleFilter.value === "" || u.role === roleFilter.value;
        return matchSearch && matchRole;
    });
});

const confirmDelete = (user) => { toDelete.value = user; };

const remove = async () => {
    if (!toDelete.value) return;
    try {
        await api.delete(`/admin/users/${toDelete.value._id}`);
        users.value = users.value.filter((u) => u._id !== toDelete.value._id);
    } catch (err) {
        alert("Thao tác thất bại");
    }
    toDelete.value = null;
};

const toggleActive = async (user) => {
    try {
        const action = user.isActive ? "lock" : "unlock";
        await api.post("/admin/users/toggle-active", { userId: user._id, action });
        user.isActive = !user.isActive;
    } catch (err) {
        alert("Thao tác thất bại");
    }
};

onMounted(load);
</script>

<style scoped>
.action-btn {
    @apply border px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 outline-none bg-white;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

table {
    table-layout: fixed;
}

td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>