"use client";
import { useOrderBy } from "@/states/config";
import React from "react";

function OrderBy() {
  const { getOrderBy, orderBy } = useOrderBy((state) => state);
  type orderType = "name" | "value" | "date";

  return (
    <>
      <p className="mt-4">Ordernar por:</p>
      <div className="flex gap-2">
        <label htmlFor="name" className="">
          <input
            type="radio"
            name="order"
            id="name"
            checked={orderBy === "name"}
            onChange={({ target }) => getOrderBy(target.id as orderType)}
          />{" "}
          Nome
        </label>
        <label htmlFor="value" className="">
          <input
            type="radio"
            name="order"
            id="value"
            checked={orderBy === "value"}
            onChange={({ target }) => getOrderBy(target.id as orderType)}
          />{" "}
          Valor
        </label>
        <label htmlFor="date" className="">
          <input
            type="radio"
            name="order"
            id="date"
            checked={orderBy === "date"}
            onChange={({ target }) => getOrderBy(target.id as orderType)}
          />{" "}
          Data
        </label>
      </div>
    </>
  );
}

export default OrderBy;
