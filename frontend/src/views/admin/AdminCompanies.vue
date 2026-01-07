<template>
    <AdminLayout pageTitle="Đối tác">
        <div class="mb-12 animate-fade-in">
            <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Quản lý <span class="text-slate-400">Doanh nghiệp</span>
            </h1>
            <div class="h-[1px] w-12 bg-slate-900 mt-6"></div>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-6 flex items-center gap-2">
                Hệ thống đối tác chiến lược JobLink
            </p>
        </div>

        <div v-if="loading"
            class="py-32 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">Syncing data...
            </p>
        </div>

        <div v-else-if="companies.length === 0"
            class="py-32 text-center bg-white border border-dashed border-slate-200 rounded-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Hiện tại chưa có dữ liệu
                doanh nghiệp</p>
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden animate-fade-in">
            <table class="min-w-full border-collapse text-left">
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên đơn vị
                        </th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trụ sở /
                            Địa chỉ</th>
                        <th
                            class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                            Hành động</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="c in companies" :key="c._id" class="hover:bg-slate-50 transition-colors group">
                        <td class="px-6 py-6">
                            <p
                                class="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                                {{ c.name }}
                            </p>
                        </td>
                        <td class="px-6 py-6">
                            <p
                                class="text-xs font-bold text-slate-500 italic tracking-tight leading-relaxed max-w-md truncate">
                                {{ c.address || 'Chưa cập nhật dữ liệu địa chỉ' }}
                            </p>
                        </td>
                        <td class="px-6 py-6 text-right">
                            <div class="flex justify-end gap-2">
                                <button @click="goToDetail(c._id)"
                                    class="action-btn border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900">
                                    Xem chi tiết
                                </button>
                                <button @click="deleteCompany(c._id)"
                                    class="action-btn border-slate-100 text-slate-300 hover:border-rose-600 hover:text-rose-600">
                                    Xóa
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-12 flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-2">
            <span>Server status: Operational</span>
            <span>Total Units: {{ companies.length }}</span>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const companies = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
    await loadCompanies();
});

const loadCompanies = async () => {
    try {
        const res = await api.get("/admin/companies");
        companies.value = res.data || [];
    } catch (err) {
        console.error("Lỗi tải danh sách công ty:", err);
    } finally {
        loading.value = false;
    }
};

const goToDetail = (id) => {
    router.push({ name: "AdminCompanyDetail", params: { id } });
};

// src/views/admin/AdminCompanies.vue

// src/views/admin/AdminCompanies.vue

const deleteCompany = async (id) => {
    // 1. Kiểm tra ID đầu vào
    if (!id) {
        alert("Lỗi: Không xác định được ID doanh nghiệp.");
        return;
    }

    // 2. Xác nhận từ người dùng
    if (!confirm("Hệ thống: Xác nhận gỡ bỏ vĩnh viễn dữ liệu doanh nghiệp này?")) return;

    try {
        // 3. Gọi API xóa (Đường dẫn này đã khớp với Backend router.delete("/:id"))
        await api.delete(`/companies/${id}`);

        // 4. Cập nhật giao diện tức thì bằng cách lọc bỏ ID đã xóa
        // Sử dụng cả c._id và c.id để đảm bảo độ chính xác tuyệt đối
        companies.value = companies.value.filter(c => c._id !== id && c.id !== id);

        alert("Đã gỡ bỏ doanh nghiệp thành công.");
    } catch (err) {
        console.error("Lỗi xóa doanh nghiệp:", err.response);

        // 5. Xử lý các mã lỗi đặc thù
        if (err.response?.status === 403) {
            alert("Lỗi 403: Bạn không có quyền Admin hoặc phiên làm việc đã hết hạn.");
        } else if (err.response?.status === 404) {
            alert("Lỗi 404: Không tìm thấy dữ liệu doanh nghiệp này trên máy chủ.");
        } else {
            alert(err.response?.data?.message || "Thao tác thất bại. Vui lòng thử lại sau.");
        }
    }
};
</script>

<style scoped>
.action-btn {
    @apply px-4 py-1.5 border rounded-md text-[9px] font-black uppercase tracking-widest transition-all active:scale-95;
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
</style>