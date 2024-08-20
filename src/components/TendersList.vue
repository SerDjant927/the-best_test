<template>
    <section class="tenders">
        <ul class="tenders-list">
            <li class="tenders-list__elem" v-for="tender in tenders" :key="tender.id">
                <Transition name="fade">
                    <p v-if="!loading">{{ currentTitles[tender.id] || '' }}</p>
                    <div v-else class="skeleton"></div>
                </Transition>
                <Transition name="fade">
                    <p v-if="!loading">{{ currentDescriptions[tender.id] || '' }}</p>
                    <div v-else class="skeleton"></div>
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
import { defineComponent, ref, onMounted } from 'vue';
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
        const tenders = ref<Tender[]>([]);
        const currentTitles = ref<{ [key: number]: string }>({});
        const currentDescriptions = ref<{ [key: number]: string }>({});
        const currentPage = ref(1);
        const itemsPerPage = 10;
        const totalPages = ref(0);
        const loading = ref(false); // Состояние загрузки

        const fetchTenders = async (page: number = 1) => {
            loading.value = true; // Устанавливаем состояние загрузки
            // Очищаем текущие заголовки и описания
            currentTitles.value = {};
            currentDescriptions.value = {};
            try {
                const response = await fetch(`https://api.test-webest.ru/list/?page=${page}&limit=${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                const data = await response.json();
                tenders.value = data.data; // Предполагается, что данные приходят в нужном формате
                totalPages.value = Math.ceil(data.total / itemsPerPage); // Обновляем общее количество страниц

                // Обновляем заголовки и описания
                tenders.value.forEach(tender => {
                    currentTitles.value[tender.id] = tender.title;
                    currentDescriptions.value[tender.id] = tender.description;
                });
            } catch (error) {
                console.error('Ошибка при получении тендеров:', error);
            } finally {
                loading.value = false; // Сбрасываем состояние загрузки
            }
        };

        onMounted(() => {
            fetchTenders(currentPage.value); // Загружаем тендеры при монтировании компонента
        });

        return {
            tenders,
            currentTitles,
            currentDescriptions,
            currentPage,
            totalPages,
            fetchTenders,
            loading, // Возвращаем состояние загрузки
        };
    },
});
</script>



<style scoped lang="scss">
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
    background-color: #e0e0e0; /* Светло-серый цвет */
    height: 1.5em; /* Высота равная line-height */
    margin: 0.5em 0; /* Отступы для визуального разделения */
    border-radius: 4px; /* Закругленные углы */
    animation: pulse 1.5s infinite; /* Анимация пульсации */
}
.skeleton {
    background-color: #e0e0e0; /* Светло-серый цвет */
    height: 1.5em; /* Высота равная line-height */
    margin: 0.5em 0; /* Отступы для визуального разделения */
    border-radius: 4px; /* Закругленные углы */
    animation: pulse 1.5s infinite; /* Анимация пульсации */
    p{
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

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
    p{
        transition: none;
    }
}
.fade-enter, .fade-leave-to /* .fade-leave-active в <2.1.8 */ {
    opacity: 0;
}
</style>