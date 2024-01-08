<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumbs from '../components/BreadCrumbs.vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const router = useRouter()
const { id } = router.currentRoute.value.params
const allExercises = [...JSON.parse(localStorage.getItem("customExercises") || "[]")]

const exercise = allExercises.find(e => {
    return e.id === parseInt(id)
}
)

const getSortedDates = () => JSON.parse(localStorage.getItem(id) || "[]").sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
})
const editEntry = ref(null)
const weight = ref(0)
const reps = ref(0)
const oldSets = ref(getSortedDates())

const onSubmit = () => {
    const previousValue = getSortedDates()
    localStorage.setItem(id, JSON.stringify([{ weight: weight.value, reps: reps.value, date: new Date() }, ...previousValue]))
    window.dispatchEvent(new CustomEvent('localstorage-changed', {
        detail: {
            storage: getSortedDates()
        }
    }));
}

window.addEventListener('localstorage-changed', (event) => {
    oldSets.value = event.detail.storage;
});


const groupedOldSets = computed(() => {
    return oldSets.value.reduce((prev, curr) => {
        const date = curr.date.toString().split("T")[0]
        return { ...prev, [date]: [...(prev[date] || []), curr] }
    }, {})
})

const showEditInput = (event) => {
    editEntry.value = event
}

const hideEditInput = () => {
    editEntry.value = null
}

const onUpdateEntry = (value) => {
    const entries = getSortedDates(id)

    const updatedEntries = entries.reduce((prev, curr) => {
        const newEntry = value.date === curr.date ? { weight: value.weight, reps: value.reps, date: value.date } : curr
        return [...prev, newEntry]
    }, [])

    localStorage.setItem(id, JSON.stringify(updatedEntries))
    hideEditInput()
    window.dispatchEvent(new CustomEvent('localstorage-changed', {
        detail: {
            storage: updatedEntries
        }
    }));
}


const total = computed(() => Object.keys(groupedOldSets.value).sort((a, b) => {
    return new Date(a) - new Date(b);
}).map(key => {
    return groupedOldSets.value[key].reduce((tot, curr) => {
        return {
            total: tot.total + curr.weight * curr.reps,
            maximum: curr.weight > tot.maximum ? curr.weight : tot.maximum,
            stackedWeights: curr.weight + tot.stackedWeights
        }
    }, { total: 0, maximum: 0, stackedWeights: 0 })
}))



const selectedGraph = ref("total")

const labels = { total: 'Total lifted (kg)', maximum: 'Maximum lifted (kg)', stackedWeights: 'Stacked weights (kg)' }

const data = computed(() => ({
    labels: Object.keys(groupedOldSets.value).sort((a, b) => {
        return new Date(a) - new Date(b);
    }),
    datasets: [
        {
            label: labels[selectedGraph.value],
            backgroundColor: '#f87979',
            data: total.value.map((t) => t[selectedGraph.value])
        }
    ]
}))

const options = {
    responsive: true,
    maintainAspectRatio: false
}

const onRadioChange = (e) => selectedGraph.value = e.target.value



</script>


<template>
    <div v-if="exercise">
        <BreadCrumbs />
        <div id="exercise">
            <div class="center-image">
                <img :src="exercise.img" />
            </div>
            <div class="content">
                <div>
                    <div class="section">
                        <h1>{{ exercise.name }}</h1>
                    </div>
                    <div class="chart-container">
                        <Line :data="data" :options="options" />
                    </div>
                    <div>
                        <legend>Select graph mode</legend>
                        <div class="horizontal">
                            <div class="alignCenter">
                                <input type="radio" id="total" value="total" :onchange="onRadioChange"
                                    v-model="selectedGraph" />
                                <label for="total">Total Weight</label>
                            </div>

                            <div class="alignCenter">
                                <input type="radio" id="maximum" value="maximum" :onchange="onRadioChange"
                                    v-model="selectedGraph" />
                                <label for="maximum">Maximum Weight</label>
                            </div>

                            <div class="alignCenter">
                                <input type="radio" id="stackedWeights" value="stackedWeights" :onchange="onRadioChange"
                                    v-model="selectedGraph" />
                                <label for="stackedWeights">Stacked Weights</label>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h3>Add new set</h3>
                        <div class="horizontal center">
                            <div class="horizontal flexEnd">
                                <h5>Weight</h5>
                                <input type="number" v-model="weight" />
                            </div>
                            <div class="horizontal flexEnd">
                                <h5>Reps</h5>
                                <input type="number" v-model="reps" />
                            </div>
                            <button @click="onSubmit">Add</button>
                        </div>
                    </div>
                    <div v-for="(sets, date) in groupedOldSets" class="section">
                        <h3>{{ date }}</h3>
                        <div v-for="set in sets" class="horizontal" @click="showEditInput(set)">
                            <div class="horizontal">
                                <h5>Weight</h5>
                                <h2 class="number">{{ set.weight }}</h2>
                            </div>
                            <div class="horizontal">
                                <h5>Reps</h5>
                                <h2 class="number">{{ set.reps }}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="editEntry" class="edit-container">
            <h1>Edit entry</h1>
            <div class="horizontal center">
                <div class="horizontal flexEnd">
                    <h5>Weight</h5>
                    <input type="number" v-model="editEntry.weight" />
                </div>
                <div class="horizontal flexEnd">
                    <h5>Reps</h5>
                    <input type="number" v-model="editEntry.reps" />
                </div>
                <button @click="onUpdateEntry(editEntry)">Update</button>
            </div>
            <button class="secondary-button" @click="hideEditInput">Close</button>

        </div>
    </div>
</template>

<style scoped>
img {
    max-width: 100%;
    max-height: 500px;
    width: 800px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.horizontal {
    gap: 12px;
    align-items: baseline;
}


.center {
    align-items: center;
}

.content {
    gap: 50px;
}

.content>div {
    width: 100%;
}

.section {
    margin-bottom: 50px;
}

h3 {
    margin-bottom: 20px;
    font-weight: 900;
}

.number {
    width: 45px;
    font-weight: 900;
    color: #b8b8b8;
}



h1 {
    color: white;
    font-weight: 900;
}

.edit-container {
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

button {
    margin-left: 30px;
}

.chart-container {
    height: 300px;
    width: 100%;
    background-color: #b8b8b8;
    margin-bottom: 50px;
    padding: 20px;
    border-radius: 15px;
}

.center-image {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}
</style>