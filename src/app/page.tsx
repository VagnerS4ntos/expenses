"use client";
import React from "react";
import CreateExpense from "./components/expense/CreateExpense";
import Balance from "./components/expense/Balance";
import SelectDate from "./components/expense/SelectDate";
import { useExpenses } from "@/states/config";
import ExpensesTable from "./components/expense/ExpensesTable";

export default function Home() {
  const { creating, setCreating } = useExpenses((state) => state);

  return (
    <>
      <section className="container py-20">
        <Balance />
        <button
          className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md mt-10"
          onClick={() => setCreating(true)}
        >
          NOVA DESPESA
        </button>

        <SelectDate />

        <ExpensesTable />

        {creating && <CreateExpense />}
      </section>
    </>
  );
}
