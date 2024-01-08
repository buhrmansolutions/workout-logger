<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    }
})

const router = useRouter()

const navigateToExercise = () => router.push(`/exercise/${props.id}`)
</script>

<template>
    <div class="exercise" @click="navigateToExercise">
        <img :src="img" />
        <h3>{{ name }}</h3>
    </div>
</template>

<style scoped>
.exercise {
    color: #000;
    border: 1px solid black;
    padding: 20px;
    background-color: #ccc;
    width: 100%;
    max-width: 320px;
    height: fit-content;
    text-align: center;
}

.exercise:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px #aaa;
}

img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;
}
</style>