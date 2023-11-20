"use client";
import React from "react";
import { years, months } from "@/utils/helpers";
import { useSelectDate } from "@/states/config";

function SelectDate() {
  const { getMonth, getYear, month, year } = useSelectDate();

  return (
    <section className="mt-4 sm:flex gap-4">
      <div>
        <label>Ano</label>
        <select
          className={`mt-1 p-2 w-full border rounded-md text-black`}
          value={year}
          onChange={({ target }) => getYear(Number(target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Mês</label>
        <select
          className={`mt-1 p-2 w-full border rounded-md text-black`}
          value={month}
          onChange={({ target }) => getMonth(Number(target.value))}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default SelectDate;
