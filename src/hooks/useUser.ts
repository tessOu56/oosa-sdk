import { useQuery, useMutation } from "@tanstack/react-query";
import { DefaultApi, Configuration } from "../generated";

const api = new DefaultApi(new Configuration());

export function useGetUser(id: string) {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.getUserById({ id });
      const parsed = UserSchema.safeParse(res);
      if (!parsed.success) {
        console.error(parsed.error);
        throw new Error("Invalid user data shape");
      }
      return parsed.data;
    },
  });
}

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.listUsers(),
  });
}

export function useCreateUser() {
  return useMutation((data: any) => api.createUser({ createUserDto: data }));
}

export function useUpdateUser() {
  return useMutation(({ id, data }: { id: string; data: any }) =>
    api.updateUser({ id, updateUserDto: data })
  );
}

export function useDeleteUser() {
  return useMutation((id: string) => api.deleteUser({ id }));
}