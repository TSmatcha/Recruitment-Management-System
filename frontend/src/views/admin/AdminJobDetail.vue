<template>
    <AdminLayout :pageTitle="'Chi tiết tin tuyển dụng'">
        <div class="w-full min-h-screen bg-gray-50 p-6 md:p-12">

            <div class="w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

                <!-- Loading -->
                <p v-if="loading" class="text-gray-500 text-center py-10 text-lg animate-pulse">
                    Đang tải dữ liệu...
                </p>

                <div v-else>

                    <!-- HEADER -->
                    <div class="flex justify-between items-center mb-10">
                        <div>
                            <h2 class="text-4xl font-bold text-gray-800 mb-2">{{ job.title }}</h2>
                            <p class="text-gray-500 text-sm">Mã tin: {{ job._id }}</p>
                        </div>

                        <router-link to="/admin/jobs"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition shadow-sm">
                            <span class="text-xl"></span> Quay lại
                        </router-link>
                    </div>

                    <!-- STATUS -->
                    <div class="mb-8">
                        <span class="px-5 py-1.5 rounded-full text-sm font-semibold shadow-md"
                            :class="job.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                            {{ job.status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt' }}
                        </span>
                    </div>

                    <!-- COMPANY -->
                    <div class="mb-10 pl-4 border-l-4 border-indigo-400">
                        <h3 class="font-semibold text-xl text-gray-800 mb-2">Công ty tuyển dụng</h3>
                        <router-link :to="'/admin/companies/' + job.company?._id"
                            class="text-indigo-600 font-medium hover:underline">
                            {{ job.company?.name || 'Không có thông tin' }}
                        </router-link>
                    </div>

                    <!-- JOB INFO -->
                    <div class="space-y-10">

                        <!-- Mô tả & Yêu cầu -->
                        <div class="pl-4 border-l-4 border-blue-400">
                            <h3 class="font-semibold text-xl text-gray-800 mb-3">Mô tả công việc</h3>
                            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ job.description || "Không có mô tả" }}</p>
                        </div>

                        <div class="pl-4 border-l-4 border-purple-400">
                            <h3 class="font-semibold text-xl text-gray-800 mb-3">Yêu cầu</h3>
                            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ job.requirements || "Không có yêu cầu" }}</p>
                        </div>

                        <!-- Các thông tin chi tiết -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Ngành nghề</h4>
                                <p class="text-gray-800 font-semibold">{{ job.career || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Cấp bậc</h4>
                                <p class="text-gray-800 font-semibold">{{ job.level || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Kinh nghiệm</h4>
                                <p class="text-gray-800 font-semibold">{{ job.experience || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Học vấn</h4>
                                <p class="text-gray-800 font-semibold">{{ job.education || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Hình thức</h4>
                                <p class="text-gray-800 font-semibold">{{ job.jobType || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Mức lương</h4>
                                <p class="text-gray-800 font-semibold">{{ job.salary || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Địa điểm</h4>
                                <p class="text-gray-800 font-semibold">{{ job.location || 'Không có' }}</p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 class="text-gray-500 text-sm mb-1">Người đăng</h4>
                                <p class="text-gray-800 font-semibold">{{ job.postedBy?.name || 'Không xác định' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div class="mt-12 flex flex-wrap gap-4">
                        <button v-if="job.status !== 'approved'" @click="approveJob"
                            class="px-8 py-3 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition"
                            :disabled="processing">
                            Duyệt tin
                        </button>

                        <button @click="deleteJob"
                            class="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 hover:border-red-400 transition shadow-sm"
                            :disabled="processing">
                            <span class="text-lg">🗑</span> Xoá tin
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";

const route = useRoute();
const router = useRouter();
const jobId = route.params.id;

const job = ref({});
const loading = ref(true);
const processing = ref(false);

async function fetchJobDetail() {
    loading.value = true;
    try {
        const res = await api.get(`/admin/jobs/${jobId}`);
        job.value = res.data;
    } catch (err) {
        console.error("Error fetching job:", err);
    } finally {
        loading.value = false;
    }
}

async function approveJob() {
    processing.value = true;
    try {
        await api.put(`/admin/jobs/${jobId}/approve`);
        job.value.status = "approved";
    } catch (err) {
        console.error("Approve error:", err);
    } finally {
        processing.value = false;
    }
}

async function deleteJob() {
    if (!confirm("Bạn chắc chắn muốn xoá tin tuyển dụng này?")) return;
    processing.value = true;
    try {
        await api.delete(`/admin/jobs/${jobId}`);
        router.push("/admin/jobs");
    } catch (err) {
        console.error("Delete error:", err);
    } finally {
        processing.value = false;
    }
}

onMounted(fetchJobDetail);
</script>
