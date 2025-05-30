import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

import firebaseConfig from '../utility/firebaseConfig'

const { appFirebaseDb } = firebaseConfig

const productsCollection = collection(appFirebaseDb, 'products')

const getProducts = async () => {
  const productsSnapshot = await getDocs(productsCollection)
  const products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  console.log('products: ', products)
  return products
}

const getProductById = async (id) => {
  const docRef = doc(productsCollection, id)
  const productSnapshot = await getDoc(docRef)
  const product = { id: productSnapshot.id, ...productSnapshot.data() }
  console.log('product by id: ', product)
  return product
}

const addProduct = async (newProduct) => {
  console.log('newProduct: ', newProduct)
  const docRef = await addDoc(productsCollection, newProduct)
  return {
    id: docRef.id,
    ...newProduct,
  }
}

const updateProduct = async (id, updatedProduct) => {
  const docRef = doc(productsCollection, id)
  await updateDoc(docRef, updatedProduct)
  return {
    id: id,
    ...updatedProduct,
  }
}

const deleteProduct = async (id) => {
  const docRef = doc(productsCollection, id)
  await deleteDoc(docRef)
  return {
    id: docRef.id,
  }
}

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
}
