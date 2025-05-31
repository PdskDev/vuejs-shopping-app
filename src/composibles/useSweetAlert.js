import Swal from 'sweetalert2'

export function useSweetAlert() {
  const showAlert = async (options) => {
    return await Swal.fire(options)
  }

  const showSuccess = async (message) => {
    return await showAlert({
      icon: 'success',
      title: 'Success',
      text: message,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const showError = async (message) => {
    return await showAlert({
      icon: 'error',
      title: 'Error occure',
      text: message,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const showConfirmation = async (message) => {
    return await showAlert({
      icon: 'warning',
      title: 'Are you sure?',
      text: message,
      position: 'center',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  }

  return {
    showSuccess,
    showError,
    showConfirmation,
  }
}
