<template>
    <AdminLayout pageTitle="Chi tiết công ty">
        <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">

            <div class="flex items-center justify-between border-b border-gray-900 pb-4">
                <h1 class="text-xl font-bold text-gray-900 tracking-tight uppercase">Thông tin doanh nghiệp</h1>
                <button @click="goBack"
                    class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                    Quay lại
                </button>
            </div>

            <div v-if="!loading && company" class="grid grid-cols-1 md:grid-cols-2 border border-gray-900 shadow-sm">

                <div class="p-8 border-b md:border-b-0 md:border-r border-gray-900">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tên công ty</p>
                    <p class="text-lg font-bold text-gray-900 uppercase tracking-tight">{{ company.name }}</p>
                </div>

                <div class="p-8 border-b border-gray-900 md:border-b-0">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Địa chỉ Email</p>
                    <p class="text-lg font-bold text-gray-900">{{ company.email || "—" }}</p>
                </div>

                <div class="p-8 border-t border-gray-900 md:col-span-2">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trụ sở chính</p>
                    <p class="text-lg font-bold text-gray-900 tracking-tight leading-relaxed">
                        {{ company.address || "Chưa có dữ liệu" }}
                    </p>
                </div>

                <div class="p-8 border-t border-r border-gray-900">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Liên hệ</p>
                    <p class="text-lg font-bold text-gray-900 tracking-tighter">{{ company.phone || "—" }}</p>
                </div>

                <div class="p-8 border-t border-gray-900 flex items-center justify-between bg-gray-50">
                    <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID Hệ thống</p>
                        <p class="text-xs font-mono font-bold text-gray-500 uppercase">{{ route.params.id }}</p>
                    </div>
                </div>

            </div>

            <div v-if="loading" class="py-20 text-center border border-dashed border-gray-300">
                <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 animate-pulse">Đang truy
                    xuất dữ liệu...</span>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const route = useRoute();
const router = useRouter();
const company = ref(null);
const loading = ref(true);

const loadCompany = async () => {
    loading.value = true;
    try {
        const res = await api.get(`/admin/companies/${route.params.id}`);
        company.value = res.data || null;
    } catch (err) {
        console.error(err);
        company.value = null;
    } finally {
        loading.value = false;
    }
};

const goBack = () => router.push("/admin/companies");
onMounted(() => loadCompany());
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>