import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
	persist(
		(set) => ({
			token: null,
			user: null,

			login: (token, user) => set({ token, user }),

			logout: () => set({ token: null, user: null }),

			refreshUser: (userData) =>
				set((state) => ({ user: { ...state.user, ...userData } })),
		}),
		{
			name: "auth-storage",
		},
	),
);

export default useAuthStore;
