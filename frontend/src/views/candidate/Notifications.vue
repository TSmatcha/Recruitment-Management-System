    <template>
        <div class="min-h-screen bg-gray-50 pt-24 px-4">
            <div class="max-w-5xl mx-auto space-y-6">

                <h1 class="text-3xl font-semibold text-gray-800 text-center mb-8">Thông báo việc làm</h1>

                <!-- Loading -->
                <div v-if="state.loading" class="text-center text-gray-500 py-16">
                    Đang tải thông báo...
                </div>

                <!-- Empty -->
                <div v-else-if="state.notifications.length === 0"
                    class="text-center text-gray-500 py-16 bg-white border rounded-xl">
                    Bạn chưa có thông báo nào.
                </div>

                <!-- List -->
                <ul v-else class="space-y-4">
                    <li v-for="note in state.notifications" :key="note._id"
                        class="cursor-pointer rounded-xl border transition hover:shadow-sm"
                        :class="note.isRead ? 'bg-white border-gray-200' : 'bg-gray-50 border-indigo-300 shadow-sm'">

                        <div @click="handleClick(note)" class="flex items-start gap-4 p-5">

                            <!-- Icon -->
                            <div class="w-10 h-10 flex items-center justify-center rounded-lg"
                                :class="note.message?.includes('duyệt') ? 'bg-emerald-100' : 'bg-rose-100'">
                                <i class="fa-solid fa-briefcase text-sm"
                                    :class="note.message?.includes('duyệt') ? 'text-emerald-700' : 'text-rose-700'"></i>
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3">
                                    <h3 class="truncate"
                                        :class="note.isRead ? 'text-sm font-medium text-gray-800' : 'text-sm font-bold text-gray-900'">
                                        {{ note.title }}
                                    </h3>

                                    <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                                        :class="note.message?.includes('duyệt') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                                        {{ note.message?.includes('duyệt') ? 'Đã duyệt' : 'Từ chối' }}
                                    </span>
                                </div>

                                <p class="text-sm mt-1" :class="note.isRead ? 'text-gray-600' : 'text-gray-800'">
                                    {{ note.message }}
                                </p>

                                <p class="text-xs text-gray-400 mt-2">{{ formatDate(note.createdAt) }}</p>
                            </div>

                            <span v-if="!note.isRead" class="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2"></span>
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    </template>

    <script setup>
    import { reactive, onMounted } from "vue";
    import axios from "@/api/axios";
    import { useRouter } from "vue-router";

    const router = useRouter();

    const state = reactive({
        notifications: [],
        loading: true
    });

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "-";

    const fetchNotifications = async () => {
        state.loading = true;
        try {
            const res = await axios.get("/notifications");
            state.notifications = res.data || [];
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) router.push("/login");
        } finally {
            state.loading = false;
        }
    };

    const handleClick = async (note) => {
        try {
            if (!note.isRead) {
                const res = await axios.patch(`/notifications/${note._id}/read`);

                // Cập nhật mảng reactive ngay
                state.notifications = state.notifications.map(n =>
                    n._id === note._id ? { ...n, isRead: true } : n
                );
            }

            const jobId = note.jobId?._id || note.jobId;
            if (jobId) router.push(`/job/${jobId}`);
        } catch (err) {
            console.error(err);
        }
    };

    onMounted(fetchNotifications);
    </script>
