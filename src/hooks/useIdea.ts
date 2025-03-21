import { useQuery, useMutation } from "@tanstack/react-query";
import { ideaApi } from "../apis/ideaApi";

export function useGetIdea(id: string) {
  return useQuery({
    queryKey: ["idea", id],
    queryFn: () => ideaApi.getIdea(id),
  });
}

export function useGetIdeas() {
  return useQuery({
    queryKey: ["ideas"],
    queryFn: ideaApi.getIdeas,
  });
}

export function useCreateIdea() {
  return useMutation(ideaApi.createIdea);
}

export function useUpdateIdea() {
  return useMutation(({ id, data }: { id: string; data: Record<string, any> }) =>
    ideaApi.updateIdea(id, data)
  );
}

export function useDeleteIdea() {
  return useMutation((id: string) => ideaApi.deleteIdea(id));
}