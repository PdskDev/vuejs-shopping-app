export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'vuejs-shop-app')

  const CLOUDINARY_URL = process.env.CLOUDINARY_URL

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'post',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url
  } catch (exception) {
    console.log(exception)
    throw exception
  }
}
