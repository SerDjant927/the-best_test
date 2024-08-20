<template>
    <div class="paginator">
        <button @click="prevPage" :disabled="isFirstPage">Назад</button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button @click="nextPage" :disabled="isLastPage">Вперед</button>
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
        const isFirstPage = computed(() => props.currentPage === 1);
        const isLastPage = computed(() => props.currentPage === props.totalPages);

        const prevPage = () => {
            if (!isFirstPage.value) {
                emit('update:currentPage', props.currentPage - 1);
                window.scrollTo(0, 0); 
            }
        };

        const nextPage = () => {
            if (!isLastPage.value) {
                emit('update:currentPage', props.currentPage + 1);
                window.scrollTo(0, 0); 
            }
        };

        return {
            prevPage,
            nextPage,
            isFirstPage,
            isLastPage,
        };
    },
});
</script>

<style scoped>
.paginator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}
</style>
