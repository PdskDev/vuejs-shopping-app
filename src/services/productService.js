import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

import firebaseConfig from '../utility/firebaseConfig'

const { appFirebaseDb } = firebaseConfig

const productsCollection = collection(appFirebaseDb, 'products')

const getProducts = async () => {
  const productsSnapshot = await getDocs(productsCollection)
  const products = productsSnapshot.docs.map((doc) => doc.data())
  console.log('products: ', products)
  return products
}

const addProduct = async (newProduct) => {
  console.log('newProduct: ', newProduct)
  const docRef = await addDoc(productsCollection, newProduct)
  return {
    id: docRef.id,
    ...newProduct,
  }
}

export default {
  getProducts,
  addProduct,
}
