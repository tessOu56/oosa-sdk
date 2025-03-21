import { useQuery, useMutation } from "@tanstack/react-query";
import { eventApi } from "../apis/eventApi";

export function useGetEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventApi.getEvent(id),
  });
}

export function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEvents,
  });
}

export function useCreateEvent() {
  return useMutation(eventApi.createEvent);
}

export function useUpdateEvent() {
  return useMutation(({ id, data }: { id: string; data: Record<string, any> }) =>
    eventApi.updateEvent(id, data)
  );
}

export function useDeleteEvent() {
  return useMutation((id: string) => eventApi.deleteEvent(id));
}