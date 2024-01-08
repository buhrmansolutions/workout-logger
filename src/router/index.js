import { createRouter, createWebHistory } from 'vue-router'
import ExercisesView from '../views/ExercisesView.vue'
import ExerciseView from '../views/ExerciseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'exercises',
      component: ExercisesView
    },
    {
      path: '/exercise/:id',
      name: 'exercise',
      component: ExerciseView
    },
  ]
})

export default router
