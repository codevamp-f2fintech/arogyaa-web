import { AlertColor } from "@mui/material/Alert";
import { User } from "@/types/user";
import { setSnackbar } from "@/redux/features/snackbarSlice";
import { io, Socket } from "socket.io-client";

export const Utility = () => {
  // WebSocket instance
  let socket: Socket | null = null;

  /**
   * Fetches data from a given API endpoint.
   * @param {string} url - The base URL of the API endpoint.
   * @param {number} page - The page number to fetch.
   * @param {number} size - The number of items to fetch per page.
   * @returns {Promise<User[]>} - A promise that resolves to an array of `User` objects.
   * @throws {Error} - Throws an error if the network request fails or if the response is not ok.
   */
  const fetchData = async (
    url: string,
    page: number,
    size: number
  ): Promise<User[]> => {
    const response = await fetch(`${url}?_page=${page}&_limit=${size}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  };

  /**
   * Get the value associated with a key from local storage.
   * @param {string} key - The key for which to retrieve the value from local storage.
   * @returns {any | null} - The value associated with the key, or null if the key is not found.
   */
  const getLocalStorage = (key: string): any | null => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null && storedValue !== "undefined") {
      try {
        return JSON.parse(storedValue);
      } catch (err) {
        console.error(`Error parsing ${key} from localStorage:`, err);
      }
    }
    return null;
  };

  /**
   * Removes a key-value pair from local storage.
   * @param {string} key - The key to be removed from local storage.
   * @returns {void}
   */
  const remLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${key} from localStorage:`, err);
    }
  };

  /**
   * Sets a key-value pair in local storage.
   * @param {string} key - The key to be set in local storage.
   * @param {any} value - The value associated with the key.
   * @returns {void}
   */
  const setLocalStorage = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error setting ${key} in localStorage:`, err);
    }
  };

  /**
   * Displays a snackbar alert, sets its severity and message, and optionally navigates to a specified path after a delay.
   *
   * @param {function} dispatch - The Redux dispatch function.
   * @param {boolean} display - Whether to display the snackbar alert.
   * @param {string} severity - The severity level of the snackbar alert (e.g., 'success', 'info', 'warning', 'error').
   * @param {string} msg - The message to be displayed in the snackbar alert.
   * @param {function|null} navigateTo - The navigation function to be called after the delay.
   * @param {string|null} [path] - The optional path to navigate to after hiding the snackbar alert.
   * @returns {void} This function does not return any value.
   */
  const snackbarAndNavigate = (
    dispatch: Function,
    display: boolean,
    severity: AlertColor,
    msg: string,
    navigateTo: Function | null = null,
    path: string | null = null,
    reload = false,
  ): void => {
    dispatch(
      setSnackbar({
        snackbarAlert: display,
        snackbarSeverity: severity,
        snackbarMessage: msg,
      })
    );
    setTimeout(() => {
      dispatch(
        setSnackbar({
          snackbarAlert: !display,
          snackbarSeverity: "info",
          snackbarMessage: "",
        })
      );
      if (path && navigateTo) {
        navigateTo(path);
        if (reload) {
          location.reload();
        }
      }
    }, 2500);
  };

  /**
   * Initializes a WebSocket connection.
   * @param {string} url - The WebSocket server URL.
   * @param {(event: any) => void} onMessage - Callback for handling incoming messages.
   * @returns {void}
   */
  const initSocket = (url: string, onMessage: (event: any) => void): void => {
    if (socket) {
      console.warn("WebSocket connection already initialized.");
      return;
    }

    socket = io(url);

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket?.id);
    });

    socket.on("message", (message) => {
      console.log("WebSocket message received:", message);
      onMessage(message);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected.");
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  };

  /**
   * Sends a message via WebSocket.
   * @param {string} event - The event name.
   * @param {any} data - The data to send with the event.
   */
  const sendMessage = (event: string, data: any): void => {
    if (!socket) {
      console.error("WebSocket is not initialized.");
      return;
    }

    socket.emit(event, data);
  };

  /**
   * Closes the WebSocket connection.
   */
  const closeSocket = (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return {
    fetchData,
    getLocalStorage,
    remLocalStorage,
    setLocalStorage,
    snackbarAndNavigate,
    initSocket,
    sendMessage,
    closeSocket,
  };
};
