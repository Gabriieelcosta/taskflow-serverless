import { defineStore } from 'pinia'
import { ref } from 'vue'
import categoryService from '@/services/categoryService'

export const useCategoryStore = defineStore('categories', () => {
  // ESTADO 
  const categories = ref([])
  const loading = ref(false)

  // ACTIONS 
  async function fetchCategories() {
    loading.value = true
    try {
      categories.value = await categoryService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data) {
    const category = await categoryService.create(data)
    categories.value.push(category)
    return category
  }

  async function updateCategory(id, data) {
    const updated = await categoryService.update(id, data)
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) categories.value[index] = updated
    return updated
  }

  async function deleteCategory(id) {
    await categoryService.remove(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  function applySSEUpdate(event) {
    if (event.type === 'category:created') {
      const exists = categories.value.find((c) => c.id === event.category.id)
      if (!exists) categories.value.push(event.category)
    } else if (event.type === 'category:updated') {
      const index = categories.value.findIndex((c) => c.id === event.category.id)
      if (index !== -1) categories.value[index] = event.category
    } else if (event.type === 'category:deleted') {
      categories.value = categories.value.filter((c) => c.id !== event.categoryId)
    }
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    applySSEUpdate,
  }
})
