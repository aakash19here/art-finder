import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { contentTypeSchema } from "../validators/contentType";
import { z } from "zod";
import axios, { AxiosError } from "axios";

export function useAddContentType() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof contentTypeSchema>) => {
      return await axios.post("/api/search", data);
    },
    onSuccess: () => {
      toast.success("Content type added successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to add content type"
        );
      } else {
        toast.error("Failed to add content type");
      }
    },
  });
}
