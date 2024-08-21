<template>
    <div class="paginator">
        <div>
            <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        </div>
        <div>
            <button @click="prevPage" :disabled="isFirstPage">Назад</button>
            <button v-for="page in firstFivePages" :key="page" @click="goToPage(page)"
                :class="{ active: currentPage === page }">
                {{ page }}
            </button>
            <button @click="nextPage" :disabled="isLastPage">Вперед</button>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'PaginatorComponent',
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
        let isFirstPage = computed(() => props.currentPage === 1);
        let isLastPage = computed(() => props.currentPage === props.totalPages);

        let firstFivePages = computed(() => {
            return Array.from({ length: Math.min(5, props.totalPages) }, (_, i) => i + 1);
        });

        let prevPage = () => {
            if (!isFirstPage.value) {
                emit('update:currentPage', props.currentPage - 1);
                window.scrollTo(0, 0);
            }
        };

        let nextPage = () => {
            if (!isLastPage.value) {
                emit('update:currentPage', props.currentPage + 1);
                window.scrollTo(0, 0);
            }
        };

        let goToPage = (page: number) => {
            emit('update:currentPage', page);
            window.scrollTo(0, 0);
        };

        return {
            prevPage,
            nextPage,
            goToPage,
            isFirstPage,
            isLastPage,
            firstFivePages,
        };
    },
});
</script>

<style scoped>
.paginator {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

button {
    margin: 0 5px;
}

button.active {
    font-weight: bold;
    background-color: #007bff;
    color: white;
}
</style>
