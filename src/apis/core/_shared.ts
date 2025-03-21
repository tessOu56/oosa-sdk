import { ApiClient } from "../../libs/apiClient";

// 你可以視需要切換為 "axios" 或 "fetch"
export const sharedApiClient = new ApiClient("https://api.oosa.com", "axios");