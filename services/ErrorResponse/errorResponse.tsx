import axios from "axios";

export const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Backend responded with an error
      console.error(`${context} Failed:`, error.response.data);
      throw new Error(error.response.data?.message || "Request failed");
    } else if (error.request) {
      // No response from server
      console.error(`${context} Failed: No response from server`);
      throw new Error("No response from server");
    } else {
      // Error in request setup
      console.error(`${context} Failed:`, error.message);
      throw new Error(error.message);
    }
  } else {
    // Non-Axios error
    console.error(`${context} Failed:`, error);
    throw new Error("Unexpected error occurred");
  }
};
