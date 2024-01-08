<script setup>
import { ref, computed } from "vue"

const name = ref(null)
const category = ref(null)
const image = ref(null)
const imageFileName = ref(null)

const isDisabled = computed(() => {
    return !Boolean(name.value)
})



const showDialog = ref(false)
const openNewExerciseDialog = () => showDialog.value = true
const hideNewExerciseDialog = () => showDialog.value = false

const onSave = () => {
    const oldExercises = JSON.parse(localStorage.getItem("customExercises") || "[]")
    const allExercises = [...oldExercises, {
        name: name.value,
        img: image.value || "https://st2.depositphotos.com/1742172/5965/v/950/depositphotos_59652469-stock-illustration-cartoon-weights.jpg",
        id: (oldExercises[oldExercises.length - 1]?.id || 0),
        category: category.value.toLowerCase(),
    }]
    localStorage.setItem("customExercises", JSON.stringify(allExercises))


    window.dispatchEvent(new CustomEvent('localstorage-changed', {
        detail: {
            exercises: allExercises
        }
    }));

    hideNewExerciseDialog()
}

const onChange = (e) => {
    const file = e.target.files[0];
    imageFileName.value = file.name
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        image.value = `data:image/png;base64, ${base64String}`
    };
    reader.readAsDataURL(file);
}

</script>

<template>
    <div>
        <button class="exercise" @click="openNewExerciseDialog">
            Add new exercise
        </button>
        <div v-if="showDialog" class="dialog">
            <h1>Add new exercise</h1>
            <img v-if="image" :src="image" class="custom-image" />
            <div class="horizontal flexEnd">
                <h5>Image</h5>
                <label class="custom-file-upload">
                    <input type="file" :onchange="onChange" id="file" accept="image/*;capture=camera" />
                    <p v-if="!image">Select image</p>
                    <p v-if="image">{{ imageFileName }}</p>
                </label>
            </div>
            <div class="horizontal flexEnd">
                <h5>Name</h5>
                <input v-model="name" />
            </div>
            <div class="horizontal flexEnd">
                <h5>Category</h5>
                <input v-model="category" />
            </div>
            <div class="horizontal">
                <button class="secondary-button" @click="hideNewExerciseDialog">Close</button>
                <button @click="onSave" :disabled="isDisabled">Save</button>
            </div>
        </div>
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
    padding: 100px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.custom-image {
    max-width: 400px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    padding: 0px;
}

h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;
}

.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 50px;
}

.dialog>.horizontal {
    gap: 20px;
}

input {
    width: 200px;
}

h5 {
    width: 81px;
    text-align: end;
    position: absolute;
    margin-left: -95px;
}

.secondary-button {
    margin-top: 0px;
}


input[type="file"] {
    display: none;
}

.custom-file-upload {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    height: 35px;
    width: 200px;
    border-radius: 5px;
    border: 2px solid white;
    font-weight: 900;
    background: none;
    text-align: center;
    color: #b8b8b8;
    -moz-appearance: textfield;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

p {
    text-wrap: nowrap;
    overflow: hidden;
    padding: 10px;
}
</style>