import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { ChatData } from "@/types/chat";

/**
 * Hook for fetching chat data with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch chat data.
 * @returns An object containing the fetched chat data, loading state, and error state.
 */
export const useGetChat = (initialData: ChatData[], pathKey: string) => {
  const { data: swrData, error } = useSWR<ChatData[]>(pathKey, fetcher, {
    fallbackData: initialData,
    refreshInterval: initialData ? 3600000 : 0, // 1 hour refresh if initialData exists
    revalidateOnFocus: false, // Disable revalidation on window focus
  });

  return { data: swrData || [], swrLoading: !error && !swrData, error };
};

/**
 * Hook for creating a new chat message.
 *
 * @param pathKey - The API path key used to create a new chat message.
 * @returns An object containing the created chat, loading state, error state, and the createChat function.
 */
export const useCreateChat = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdChat, setCreatedChat] = useState<ChatData | null>(null);

  const createChat = async (newChat: ChatData) => {
    setLoading(true);
    setError(null);

    try {
      const chat = await creator<ChatData, ChatData>(pathKey, newChat);
      setCreatedChat(chat);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createdChat, loading, error, createChat };
};

/**
 * Hook for modifying an existing chat message.
 *
 * @param pathKey - The API path key used to modify a chat message.
 * @returns An object containing the updated chat, loading state, error state, and the modifyChat function.
 */
export const useModifyChat = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedChat, setUpdatedChat] = useState<ChatData | null>(null);

  const modifyChat = async (updatedChatData: ChatData) => {
    setLoading(true);
    setError(null);

    try {
      const chat = await modifier<ChatData, ChatData>(pathKey, updatedChatData);
      setUpdatedChat(chat);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { updatedChat, loading, error, modifyChat };
};
