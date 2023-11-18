import { create } from "zustand";
import { userT, expenseStateT, selectDateT } from "@/app/types/config";
import { User } from "firebase/auth";

export const useUser = create<userT>((set) => ({
  user: {} as User,
  getUser: (data) => set({ user: data }),
}));

export const useExpenses = create<expenseStateT>((set) => ({
  creating: false,
  setCreating: (data) => set({ creating: data }),
  deleting: false,
  setDeleting: (data) => set({ deleting: data }),
  editing: false,
  setEditing: (data) => set({ editing: data }),
  expensesData: [],
  getExpensesData: (data) => set({ expensesData: data }),
  expensesByDate: [],
  getExpensesByDate: (data) => set({ expensesByDate: data }),
}));

export const useSelectDate = create<selectDateT>((set) => ({
  year: new Date().getFullYear(),
  getYear: (data) => set({ year: data }),
  month: new Date().getMonth(),
  getMonth: (data) => set({ month: data }),
}));
