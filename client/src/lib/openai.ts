import { apiRequest } from "./queryClient";

export interface ChatResponse {
  response: string;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat", { message });
  return response.json();
}
