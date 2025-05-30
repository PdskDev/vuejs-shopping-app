<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">Create Product</div>
          <hr />
          <div class="alert alert-danger pb-0" v-if="errorList.length > 0">
            Please fix the following errors:
            <ul v-for="error in errorList" :key="error">
              <li>{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input
              type="text"
              class="form-control"
              v-model.trim="productObject.name"
              aria-label="Name"
            />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea
              type="text"
              class="form-control"
              v-model.trim="productObject.description"
              aria-label="Description"
            ></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input
              type="number"
              class="form-control"
              v-model.number="productObject.price"
              aria-label="Price"
            />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input
              type="number"
              class="form-control"
              v-model.number="productObject.salePrice"
              aria-label="Sale Price"
            />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              type="text"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
              v-model.trim="productObject.tags"
              aria-label="Tags"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="productObject.isBestseller"
              aria-label="Bestseller"
            />

            <label class="form-check-label" for="bestseller"> Bestseller </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productObject.category" aria-label="Category">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input type="file" class="form-control" aria-label="Image" />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <a href="/" class="btn btn-secondary m-2 w-25"> Cancel </a>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="`https://placehold.co/600x400`"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PRODUCT_CATEGORIES } from '@/constants/productConstants'
import { useSweetAlert } from '@/utility/useSweetAlert'
import productService from '@/services/productService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const { addProduct } = productService

const { showSuccess, showError, showConfirmation } = useSweetAlert()

const router = useRouter()

const isLoading = ref(false)
const errorList = reactive([])

const categories = ref(PRODUCT_CATEGORIES)

const productObject = reactive({
  name: '',
  description: '',
  price: 0,
  salePrice: 0,
  tags: [],
  isBestseller: false,
  category: '',
  image: '',
})

function validateForm() {
  errorList.length = 0

  if (!productObject.name) {
    errorList.push('Name is required')
  }

  if (productObject.name.length < 3) {
    errorList.push('Name must be at least 3 characters long')
  }

  if (!productObject.description) {
    errorList.push('Description is required')
  }

  if (productObject.description.length < 20) {
    errorList.push('Description must be at least 20 characters long')
  }

  if (!productObject.price) {
    errorList.push('Price is required')
  }

  if (!productObject.category) {
    errorList.push('Category is required')
  }
}

async function handleSubmit() {
  try {
    isLoading.value = true

    validateForm()

    if (!errorList.length) {
      const productData = {
        ...productObject,
        price: Number(productObject.price),
        salePrice: productObject.salePrice ? Number(productObject.salePrice) : null,
        tags:
          productObject.tags.length > 0
            ? productObject.tags.split(',').map((tag) => tag.trim())
            : [],
        bestSeller: Boolean(productObject.isBestseller),
      }

      const productCreated = await addProduct(productData)

      showSuccess('Product created successfully')

      console.log('productData: ', productData)

      console.log('product created: ', productCreated)
      router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
    }
  } catch (error) {
    console.log('error: ', error)
  } finally {
    isLoading.value = false
  }
}
</script>
