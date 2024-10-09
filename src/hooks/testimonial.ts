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
  initialData: Testimonial[],
  pathKey: string
) => {
  const { data: swrData, error } = useSWR<Testimonial[]>(pathKey, fetcher, {
    fallbackData: initialData,
    refreshInterval: initialData ? 3600000 : 0,
    revalidateOnFocus: false,
  });

  return { data: swrData || [], swrLoading: !error && !swrData, error };
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
  const [createdTestimonial, setCreatedTestimonial] =
    useState<Testimonial | null>(null);

  const createTestimonial = async (newTestimonialData: Testimonial) => {
    setLoading(true);
    setError(null);

    try {
      const testimonial = await creator<Testimonial, Testimonial>(
        pathKey,
        newTestimonialData
      );
      setCreatedTestimonial(testimonial);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createdTestimonial, loading, error, createTestimonial };
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
  const [updatedTestimonial, setUpdatedTestimonial] =
    useState<Testimonial | null>(null);

  const modifyTestimonial = async (updatedTestimonialData: Testimonial) => {
    setLoading(true);
    setError(null);

    try {
      const testimonial = await modifier<Testimonial, Testimonial>(
        pathKey,
        updatedTestimonialData
      );
      setUpdatedTestimonial(testimonial);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { updatedTestimonial, loading, error, modifyTestimonial };
};
