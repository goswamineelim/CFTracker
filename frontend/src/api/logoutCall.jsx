const API_URL = "http://localhost:5000/api"; // You can use environment variables here in production

export const logoutUser = async () => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // This sends the HttpOnly cookie to the backend
    });
  } catch (error) {
    console.error('Logout API failed:', error);
  }
};