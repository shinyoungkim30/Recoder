import apiClient from './apiClient'

export const uploadFile = async ( file ) => {
  try {
    await apiClient.post('/in/img', file)
  } catch (error) {
    console.error(error);
  }
}