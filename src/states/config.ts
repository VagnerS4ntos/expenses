import { create } from "zustand";
import { userT, expenseStateT, selectDateT, orderByT } from "@/types/config";
import { User } from "firebase/auth";

/********************* USER  *************************/
export const useUser = create<userT>((set) => ({
  user: {} as User,
  getUser: (data) => set({ user: data }),
}));

/********************* EXPENSES  *************************/
export const useExpenses = create<expenseStateT>((set) => ({
  creating: false,
  setCreating: (data) => set({ creating: data }),
  deleting: false,
  setDeleting: (data) => set({ deleting: data }),
  editing: false,
  setEditing: (data) => set({ editing: data }),
  fetchingExpenses: true,
  setFetchingExpenses: (data) => set({ fetchingExpenses: data }),
  expensesData: [],
  getExpensesData: (data) => set({ expensesData: data }),
  expensesByDate: [],
  getExpensesByDate: (data) => set({ expensesByDate: data }),
}));

/********************* DATE  *************************/
export const useSelectDate = create<selectDateT>((set) => ({
  year: new Date().getFullYear(),
  getYear: (data) => set({ year: data }),
  month: new Date().getMonth(),
  getMonth: (data) => set({ month: data }),
}));

/********************* ORDER  *************************/
export const useOrderBy = create<orderByT>((set) => ({
  orderBy: "name",
  getOrderBy: (data) => set({ orderBy: data }),
}));
