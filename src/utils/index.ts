import { AlertColor } from "@mui/material/Alert";
import { jwtDecode } from "jwt-decode";

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
  ): Promise<any> => {
    const response = await fetch(`${url}?_page=${page}&_limit=${size}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  };

  /**
   * Function to capitalize 1st letter of a string
   * @param str - The string whose 1st letter is to be capitalized
   * @returns
   */
  const capitalizeFirstLetter = (str: string) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  };

  // Function to calculate the number of days ago
  const calculateDaysAgo = (date: string) => {
    const today = new Date();
    const addedDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - addedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  /**
   * Returns the appropriate base URL based on the service name.
   *
   * @param serviceName - The key representing the microservice.
   * @returns The base URL for the specified microservice.
   */
  const getServiceUrl = (serviceName: string): string => {
    const urls: Record<string, string> = {
      appointment: process.env.NEXT_PUBLIC_APPOINTMENT_URL as string,
      speciality: process.env.NEXT_PUBLIC_SPECIALITY_URL as string,
      symptom: process.env.NEXT_PUBLIC_SYMPTOM_URL as string,
      qualification: process.env.NEXT_PUBLIC_QUALIFICATION_URL as string,
      doctor: process.env.NEXT_PUBLIC_DOCTOR_URL as string,
      patient: process.env.NEXT_PUBLIC_PATIENT_URL as string,
    };

    return urls[serviceName] || "";
  };

  /**
   * Utility to store value in sessionStorage.
   * @param {string} key - The key to set in sessionStorage.
   * @param {any} value - The value to store.
   */
  const setSessionStorage = (key: string, value: any): void => {
    if (typeof window !== "undefined") {
      // Check if window is available (client-side)
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  };

  /**
   * Utility to get value from sessionStorage.
   * @param {string} key - The key to retrieve the value for.
   * @returns {any | null} - The retrieved value or null if not found.
   */
  const getSessionStorage = (key: string): any | null => {
    if (typeof window !== "undefined") {
      // Ensure we're on the client-side
      const storedValue = sessionStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null; // Return null if window is not available (server-side)
  };

  /**
   * Get the value associated with a key from local storage.
   * @param {string} key - The key for which to retrieve the value from local storage.
   * @returns {any | null} - The value associated with the key, or null if the key is not found.
   */
  const getLocalStorage = (key: string): any | null => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
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
    } catch (err) { }
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
    } catch (err) { }
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
   * Get cookies from document.cookie and return them as an object.
   * @returns {Object} An object representing the cookies.
   */
  const getCookies = (): object => {
    if (typeof document === "undefined") {
      return {};
    }
    const cookieString = document?.cookie; // Get cookies as a string
    const cookiesArray = cookieString.split("; "); // Split into an array
    const cookies: Record<string, string> = {};

    // Convert array into a key-value pair object
    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookies[key] = decodeURIComponent(value);
    });

    return cookies;
  };

  /**
   * Set a cookie with an optional expiration time (default 7 days).
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   */
  const setCookie = (name: string, value: string): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
  };

  /**
   * Decode the JWT token stored in cookies.
   * @returns {any | null} - Decoded token payload, or null if token not found or invalid.
   */
  const decodedToken = (token = null): any | null => {
    // Prioritize server-side provided token
    if (typeof document === "undefined") {
      if (token) {
        try {
          return jwtDecode(token);
        } catch (error) {
          console.log("Error decoding token (server-side):", error);
          return null;
        }
      }
      return {}; // No token provided server-side
    }
    // Client-side handling
    if (!token) {
      const cookies = getCookies();
      token = cookies?.token;
    }
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.log("Error decoding token (client-side):", error);
        return null;
      }
    }
    console.log("No token found in cookies");
    return null;
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
    capitalizeFirstLetter,
    calculateDaysAgo,
    decodedToken,
    fetchData,
    formatDate,
    getServiceUrl,
    getSessionStorage,
    setSessionStorage,
    getLocalStorage,
    remLocalStorage,
    setLocalStorage,
    snackbarAndNavigate,
    initSocket,
    sendMessage,
    closeSocket,
    getCookies,
    setCookie,
  };
};
