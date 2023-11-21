import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { expenseDataT } from "../types/config";

export const ROUTE_PROTECTED_REGEX = /\/(?!.)|\/settings(?!.)/i;

//Cria o array dos anos para o select
const currentYear = new Date().getFullYear();
export const years: number[] = [];
for (let i = 2023; i < currentYear + 2; i++) {
  years.push(i);
}

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

//Converte um número para moeda
export function convertNumberToCurrency(value: number) {
  return value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}

//Pega data no formato AAAA-MM-DD para colocar no input
//Quando o parâmetro 'date' não é utilizado, pegamos a data atual
export function getInputDateFormat(date?: any) {
  let currentDate = new Date();

  if (date) {
    currentDate = date;
  }

  return currentDate.toISOString().split("T")[0];
}

//Pega todas as despesas do usuário
export async function getAllExpensesDatabase(user_id: string) {
  try {
    const expensesRef = collection(db, user_id);

    const data = await getDocs(expensesRef);

    const expenses = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as expenseDataT[];

    expenses.map(
      (item: any) => (item.date = new Date(item.date.seconds * 1000))
    );

    expenses.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    return expenses;
  } catch (error) {
    console.error("Erro ao obter despesas:", error);
    throw error;
  }
}

//Pega as despesas de acordo com o ano e o mês
export function getExpensesDatabaseByDate(
  expenses: expenseDataT[],
  year: number,
  month: number
) {
  const data = expenses.filter(
    (expense) =>
      new Date(expense.date).getFullYear() == year &&
      new Date(expense.date).getMonth() == month
  );

  return data;
}

//Formata a data para o padrão DD/MM para renderizar na tabela
export function convertDate(date: string) {
  const day = new Date(date).getUTCDate();
  const month = new Date(date).getUTCMonth() + 1;

  const convertedDate = `${JSON.stringify(day).padStart(2, "0")}/${month}`;
  return convertedDate;
}
