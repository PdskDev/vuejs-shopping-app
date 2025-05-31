<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">{{ actionTitle }} Product</div>
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
              <input
                type="file"
                class="form-control"
                aria-label="Image"
                @change="handleImageUpload"
                :disabled="isLoading || isImageLoading"
              />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="isLoading || isImageLoading">
              <span
                v-if="isLoading || isImageLoading"
                class="spinner-border spinner-border-sm me-2"
              ></span
              >{{ actionTitle }}
            </button>
            <router-link
              :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }"
              class="btn btn-secondary m-2 w-25"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productObject.image ? productObject.image : `https://placehold.co/600x400`"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PRODUCT_CATEGORIES } from '@/constants/productConstants'
import { useSweetAlert } from '@/utility/useSweetAlert'
import productService from '@/services/productService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { uploadToCloudinary } from '@/utility/cloudinary'

const { showSuccess, showError } = useSweetAlert()

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const isImageLoading = ref(false)
const errorList = reactive([])
const categories = ref(PRODUCT_CATEGORIES)

const productIdForUpdate = route.params.id

const actionTitle = productIdForUpdate ? 'Update' : 'Create'

onMounted(() => {
  getProductById(productIdForUpdate)
})

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

  if (productObject.description.length < 10) {
    errorList.push('Description must be at least 10 characters long')
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

      console.log('productData: ', productData)

      if (productIdForUpdate) {
        const productUpdated = await productService.updateProduct(productIdForUpdate, productData)
        showSuccess('Product updated successfully')
        console.log('product updated: ', productUpdated)
      } else {
        const productCreated = await productService.addProduct(productData)
        showSuccess('Product created successfully')
        console.log('product created: ', productCreated)
      }

      router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
    }
  } catch (error) {
    console.log('error: ', error)
  } finally {
    isLoading.value = false
  }
}

const getProductById = async (productId) => {
  console.log('productId: ', productId)

  if (!productId) return
  if (productId) {
    try {
      isLoading.value = true
      const returnedProduct = await productService.getProductById(productId)
      Object.assign(productObject, { ...returnedProduct, tags: returnedProduct.tags.join(', ') })
      isLoading.value = false
      console.log('fetch productToUpdate: ', returnedProduct)
    } catch (error) {
      isLoading.value = false
      console.log('error: ', error)
    } finally {
      isLoading.value = false
    }
  }
}

const handleImageUpload = async (event) => {
  const imageFile = event.target.files[0]

  if (!imageFile) return

  try {
    isImageLoading.value = true
    const newImageUrl = await uploadToCloudinary(imageFile)
    productObject.image = newImageUrl
    isImageLoading.value = false
  } catch (exception) {
    showError(exception.message)
    console.log('error when uploading image: ', exception)
    isImageLoading.value = false
    throw exception
  } finally {
    isImageLoading.value = false
  }
}
</script>
