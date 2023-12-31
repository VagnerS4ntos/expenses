import React from "react";
import Link from "next/link";

function NotFound() {
  return (
    <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="font-semibold text-red-600 text-xl">404</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mt-6  leading-7 ">
          Desculpe, não conseguimos encontrar a página que você está procurando
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
