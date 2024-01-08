<script setup>
import { computed, ref } from "vue"
import Exercise from "../components/Exercise.vue"

import NewExercise from '../components/NewExercise.vue'


const customExercises = JSON.parse(localStorage.getItem("customExercises") || "[]")
const allExercises = ref([...customExercises])

const selectedFilter = ref("All")
const showDropdown = ref(false)


window.addEventListener('localstorage-changed', (event) => {
    allExercises.value = [...event.detail.exercises];
});

const groupedExercises = computed(() => {
    return allExercises.value.reduce((prev, curr) => {
        return {
            ...prev,
            [curr.category]: [
                ...(prev[curr.category] || []),
                curr
            ]
        }
    }, {})
})

const onRadioChange = (e) => {
    console.log(e)
    selectedFilter.value = e.target.value
    showDropdown.value = false
}


const onClickFilter = () => showDropdown.value = true
const onClickOutsideDropdown = () => showDropdown.value = false

</script>

<template>
    <div class="horizontal">
        <h1>Exercises</h1>
        <NewExercise />
    </div>
    <div class="filters">
        <button @click="onClickFilter" :class="showDropdown && 'opendropdownbutton'">
            Showing categories: {{ selectedFilter }}
        </button>
        <div class="dropdown" @focusout="onClickOutsideDropdown" tabindex="0" v-if="showDropdown">
            <div class="alignCenter" @click="onRadioChange({
                target: { value: 'All' }
            })">
                <input type="radio" id="All" value="All" :onchange="onRadioChange" v-model="selectedFilter" />
                <label for="total">All</label>
            </div>
            <div v-for="category in Object.keys(groupedExercises)" class="alignCenter"
                @click="onRadioChange({ target: { value: category } })">
                <input type="radio" :id="category" :value="category" :onchange="onRadioChange" v-model="selectedFilter" />
                <label :for="category">{{ category }}</label>
            </div>
        </div>
    </div>
    <div>
        <div v-for="category in Object.keys(groupedExercises)">
            <div v-if="selectedFilter === 'All' || selectedFilter === category">
                <h2>{{ category }}</h2>
                <div class="content">
                    <Exercise v-for="exercise in  groupedExercises[category]" :name="exercise.name" :id="exercise.id"
                        :img="exercise.img" />
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.opendropdownbutton {
    border-radius: 15px 15px 0px 0px;
}

.filters {
    margin-bottom: 20px;
}

.dropdown {
    position: absolute;
    background-color: white;
    border-radius: 0px 20px 20px;
    padding: 0px 20px;
    width: fit-content;
    min-width: 320px;
}

h1 {
    margin-bottom: 50px;
}

h2,
label,
button {
    text-transform: capitalize;
}

label {
    color: black;
    font-weight: bold;
}

.content {
    margin-bottom: 50px;
}

.horizontal {
    justify-content: space-between;
}

.no-space {
    justify-content: flex-start;
    gap: 50px;
}

.alignCenter {
    margin-bottom: 20px;
}
</style>