import { useState } from 'react';
import useSWR from 'swr';

import { creator, fetcher, modifier } from '@/apis/apiClient';
import { Notifications } from '@/types/notifications';

/**
 * Hook for fetching notificationss with SWR (stale-while-revalidate) strategy.
 * 
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch notifications data.
 * @returns An object contFaining the fetched notificationss, loading state, and error state.
 */
export const useGetNotifications = (initialData: Notifications[], pathKey: string) => {
    const { data: swrData, error } = useSWR<Notifications[]>(pathKey, fetcher, {
        fallbackData: initialData,
        refreshInterval: initialData ? 3600000 : 0, // 1 hour refresh if initialData exists
        revalidateOnFocus: false,                  // Disable revalidation on window focus
    });

    return { data: swrData || [], swrLoading: !error && !swrData, error };
};

/**
 * Hook for creating a new notifications.
 * 
 * @param pathKey - The API path key used to create a new notifications.
 * @returns An object containing the created notifications, loading state, error state, and the createNotifications function.
 */
export const useCreateNotifications = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [createdNotifications, setCreatedNotifications] = useState<Notifications | null>(null);

    const createNotifications = async (newNotificationsData: Notifications) => {
        setLoading(true);
        setError(null);

        try {
            const notifications = await creator<Notifications, Notifications>(pathKey, newNotificationsData);
            setCreatedNotifications(notifications);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { createdNotifications, loading, error, createNotifications };
};

/**
 * Hook for modifying an existing notifications.
 * 
 * @param pathKey - The API path key used to modify a notifications.
 * @returns An object containing the updated notifications, loading state, error state, and the modifyNotifications function.
 */
export const useModifyNotifications = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [updatedNotifications, setUpdatedNotifications] = useState<Notifications | null>(null);

    const modifyNotifications = async (updatedNotificationsData: Notifications) => {
        setLoading(true);
        setError(null);

        try {
            const notifications = await modifier<Notifications, Notifications>(pathKey, updatedNotificationsData);
            setUpdatedNotifications(notifications);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { updatedNotifications, loading, error, modifyNotifications };
};
