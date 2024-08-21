<template>
    <section class="tenders">
        <div class="search-container">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Поиск по тендерам..."
                @input="filterTenders"
            />
        </div>
        <ul class="tenders-list">
            <li class="tenders-list__elem" v-for="tender in filteredTenders" :key="tender.id">
                <Transition name="fade">
                    <router-link :to="`/tender/${tender.id}`" @click="navigateToDetail">
                        <p v-if="!loading">{{ currentTitles[tender.id] || '' }}</p>
                        <div v-else class="skeleton"></div>
                    </router-link>
                </Transition>
            </li>
        </ul>
        <PaginatorComponent 
            :currentPage="currentPage" 
            :totalPages="totalPages"
            @update:currentPage="(page) => { currentPage = page; fetchTenders(page); }" 
        />
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import PaginatorComponent from './PaginatorComponent.vue';

interface Tender {
    id: number;
    title: string;
    description: string;
}

export default defineComponent({
    name: 'TendersList',
    components: {
        PaginatorComponent,
    },
    setup() {
        let tenders = ref<Tender[]>([]);
        let currentTitles = ref<{ [key: number]: string }>({});
        let currentDescriptions = ref<{ [key: number]: string }>({});
        let currentPage = ref(1);
        let itemsPerPage = 30;
        let totalPages = ref(0);
        let loading = ref(false);
        let searchQuery = ref('');

        let fetchTenders = async (page: number = 1) => {
            loading.value = true;
            currentTitles.value = {};
            currentDescriptions.value = {};
            try {
                let response = await fetch(`https://api.test-webest.ru/list/?page=${page}&limit=${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                let data = await response.json();
                let receivedTenders = data.data;
                tenders.value = receivedTenders.slice(0, itemsPerPage);
                totalPages.value = Math.ceil(data.total / itemsPerPage);

                tenders.value.forEach(tender => {
                    currentTitles.value[tender.id] = tender.title;
                    currentDescriptions.value[tender.id] = tender.description;
                });
            } catch (error) {
                console.error('Ошибка при получении тендеров:', error);
            } finally {
                loading.value = false;
            }
        };

        let filteredTenders = computed(() => {
            if (!searchQuery.value) {
                return tenders.value;
            }
            return tenders.value.filter(tender =>
                tender.title.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        const filterTenders = () => {
            filteredTenders.value;
        };

        onMounted(() => {
            fetchTenders(currentPage.value);
        });

        return {
            tenders,
            currentTitles,
            currentDescriptions,
            currentPage,
            totalPages,
            fetchTenders,
            loading,
            searchQuery,
            filteredTenders,
            filterTenders,
        };
    },
});
</script>

<style scoped lang="scss">
.search-container {
    margin-bottom: 20px;
}

.search-container input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
}
.tenders-list {
    padding: 20px 12px;
    list-style: none;
    margin: 0;
    display: grid;
    row-gap: 20px;
    column-gap: 20px;
    grid-template-columns: repeat(5, 1fr);

    &__elem {
        padding: 4px;
        border: 1px solid grey;
    }

    p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        max-height: 4.5em;
    }
}

.skeleton {
    background-color: #e0e0e0;
    height: 1.5em;
    margin: 0.5em 0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;

    p {
        transition: opacity 0s;
    }
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;

    p {
        transition: none;
    }
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>