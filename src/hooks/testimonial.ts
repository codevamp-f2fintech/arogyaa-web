
import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Testimonial } from "@/types/testimonial";

/**
 * Hook for fetching testimonials with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch testimonials data.
 * @returns An object containing the fetched testimonials, loading state, and error state.
 */
export const useGetTestimonial = (
  initialData: Testimonial | null,
  pathKey: string,
  page: number = 1,
  limit: number = 5
) => {
  const url = `${pathKey}?page=${page}&limit=${limit}`;
  console.log(url,"url is")
  const { data: swrData, error, isValidating, mutate } = useSWR<Testimonial | null>(
    url,
    () => fetcher<Testimonial>('testimonial', url),
    {
      fallbackData: initialData,
      refreshInterval: 3600000,
      revalidateOnFocus: false,
    }
  );
  const refetch = async (keyword?: string) => {
    const refetchUrl = keyword ? `${url}&keyword=${keyword}` : url;
    return await mutate(() => fetcher<Testimonial>('testimonial', refetchUrl));
  };

  return {
    value: swrData || {
      results: [],
      count: 0,
      pages: 0,
      errorMessage: null
    },
    swrLoading: !error && !swrData && isValidating,
    error,
    refetch
  };
};

/**
 * Hook for creating a new testimonial.
 *
 * @param pathKey - The API path key used to create a new testimonial.
 * @returns An object containing the created testimonial, loading state, error state, and the createTestimonial function.
 */
export const useCreateTestimonial = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTestimonial = async (newTestimonialData: Testimonial) => {
    setLoading(true);
    setError(null);
    try {
      const testimonial = await creator<Testimonial, Testimonial>(
        'testimonial',
        pathKey,
        newTestimonialData
      );
      return testimonial;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createTestimonial };
};

/**
 * Hook for modifying an existing testimonial.
 *
 * @param pathKey - The API path key used to modify a testimonial.
 * @returns An object containing the updated testimonial, loading state, error state, and the modifyTestimonial function.
 */
export const useModifyTestimonial = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const modifyTestimonial = async (updatedTestimonialData: Testimonial) => {
    setLoading(true);
    setError(null);
    try {
      const testimonial = await modifier<Testimonial, Testimonial>(
        'testimonial',
        pathKey,
        updatedTestimonialData
      );
      return testimonial;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, modifyTestimonial };
};
