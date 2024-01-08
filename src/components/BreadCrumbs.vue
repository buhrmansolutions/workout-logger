<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const { id } = router.currentRoute.value.params
let pathCreadcrumb = null
if (id) {
    const allExercises = [...JSON.parse(localStorage.getItem("customExercises") || "[]")]
    pathCreadcrumb = { value: allExercises.find(exercise => exercise.id === parseInt(id)).name, path: `/${id}` }
}
const breadcrumbs = [{ value: "Exercises", path: "/" }, pathCreadcrumb].filter(Boolean)
</script>

<template>
    <div class="container">
        <div v-for="(breadcrumb, index) in breadcrumbs" class="horizontal">
            <div v-if="index !== breadcrumbs.length - 1">
                <a :href="breadcrumb.path">{{ breadcrumb.value }}</a>
                >
            </div>
            <div v-if="index === breadcrumbs.length - 1">
                {{ breadcrumb.value }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.horizontal {
    display: flex;
    align-items: center;
    gap: 20px;
    text-decoration: none;
    font-size: 16px;
    color: white;
}

.container {
    display: flex;
    gap: 20px;
    margin-bottom: 50px;
}

a {
    text-decoration: none;
    font-size: 16px;
    color: #9f9f9f;
    margin-right: 20px;
}

a:hover {
    background-color: transparent;
}
</style>