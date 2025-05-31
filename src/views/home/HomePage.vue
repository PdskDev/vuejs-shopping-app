<template>
  <div>
    <div
      class="bg-success w-100 position-relative overflow-hidden mb-4 py-5 d-flex align-items-center"
      style="
        background-image: url('https://www.heinens.com/content/uploads/2021/02/Organic-Fruits-and-Vegetables_800x550.jpg');
        background-size: cover;
        background-position: center;
        min-height: 400px;
      "
    >
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-success opacity-50"></div>

      <div class="container-fluid position-relative z-1">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8 col-xl-7">
            <h1 class="display-6 fw-bold text-white mb-4">
              Your one-stop shop for organic foods
              <br class="d-none d-lg-block" />
              that respects your health and our environment!
            </h1>
            <div class="input-group mt-3 mx-auto shadow-lg rounded-4" style="max-width: 700px">
              <input
                v-model.trim="searchValue"
                type="text"
                class="form-control border-0 py-3 px-4 fs-5"
                placeholder="Search your favorite product..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="product-list" class="container">
      <h2 class="mb-5 text-center display-6">Discover Our Collection</h2>

      <div class="row g-3 mb-4 align-items-center">
        <div class="col-md-auto">
          <div class="d-flex flex-wrap gap-3">
            <button
              class="btn px-4 py-2"
              :class="{
                'btn-success text-white': category === selectedCategory,
                'btn-outline-success': category !== selectedCategory,
              }"
              @click="selectedCategory = category"
              v-for="(category, index) in categoryList"
              :key="index"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="col-md-auto ms-md-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-2"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down"></i>
              <span class="text-capitalize">{{ selectedSortOption }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li v-for="(sort, index) in SORT_OPTIONS" :key="index">
                <button
                  class="dropdown-item py-2 d-flex align-items-center gap-2"
                  @click="selectedSortOption = sort"
                >
                  <i class="bi"></i>
                  <span class="text-capitalize"> {{ sort }} </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div class="row g-4 pb-4" v-if="filterProductsByCategory.length > 0">
          <ProductCard
            v-for="product in filterProductsByCategory"
            :key="product.id"
            :product="product"
          ></ProductCard>
        </div>
        <div v-else>
          <h3 class="text-center">No product found</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import productService from '@/services/productService'
import ProductCard from '@/components/product/ProductCard.vue'
import {
  PRODUCT_CATEGORIES,
  SORT_NAME_A_Z,
  SORT_NAME_Z_A,
  SORT_PRICE_LOW_HIGH,
  SORT_PRICE_HIGH_LOW,
  SORT_OPTIONS,
} from '@/constants/productConstants'

const products = ref([])
const isLoading = ref(false)
const searchValue = ref('')
const selectedCategory = ref('ALL')
const categoryList = ref(['ALL', ...PRODUCT_CATEGORIES])
const selectedSortOption = ref(SORT_OPTIONS[0])

onMounted(async () => {
  fetchProducts()
})

const fetchProducts = async () => {
  try {
    isLoading.value = true
    products.value = await productService.getProducts()
    isLoading.value = false
    console.log('products: ', products)
  } catch (error) {
    isLoading.value = false

    console.log('error: ', error)
  } finally {
    isLoading.value = false
  }
}

const filterProductsByCategory = computed(() => {
  let tempsProductsFiltered =
    selectedCategory.value === 'ALL'
      ? [...products.value]
      : products.value.filter(
          (item) => item.category.toLowerCase() === selectedCategory.value.toLowerCase(),
        )

  if (searchValue.value) {
    tempsProductsFiltered = tempsProductsFiltered.filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase()),
    )
  }

  if (selectedSortOption.value === SORT_NAME_A_Z) {
    tempsProductsFiltered = tempsProductsFiltered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (selectedSortOption.value === SORT_NAME_Z_A) {
    tempsProductsFiltered = tempsProductsFiltered.sort((a, b) => b.name.localeCompare(a.name))
  } else if (selectedSortOption.value === SORT_PRICE_LOW_HIGH) {
    tempsProductsFiltered = tempsProductsFiltered.sort((a, b) => a.salePrice - b.salePrice)
  } else if (selectedSortOption.value === SORT_PRICE_HIGH_LOW) {
    tempsProductsFiltered = tempsProductsFiltered.sort((a, b) => b.salePrice - a.salePrice)
  }

  return tempsProductsFiltered
})
</script>
