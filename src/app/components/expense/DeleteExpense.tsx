import React from "react";
import { useExpenses, useUser } from "@/states/config";
import { db } from "@/firebase/client";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function DeleteExpense({ id }: { id: string }) {
  const { setDeleting } = useExpenses((state) => state);
  const { user } = useUser((state) => state);

  //Fecha a janela para excluir uma despesa
  function closeDeletingExpense(event: any) {
    if (event.target.dataset.close) {
      setDeleting(false);
    }
  }

  async function deleteExpense() {
    try {
      const user_id = user.uid;
      await deleteDoc(doc(db, user_id, id));
      toast.success("Despesa deletada com sucesso!");
      setDeleting(false);
    } catch (error) {
      toast.error("Algo deu errado");
      console.log(error);
    }
  }

  return (
    <section
      className="bg-white bg-opacity-60 fixed inset-0 grid place-items-center px-2"
      data-close={true}
      onClick={closeDeletingExpense}
    >
      <div className="bg-zinc-900 p-6 rounded-md max-w-sm w-1/2 min-w-max">
        <p className="mb-2 text-2xl">DELETAR DESPESA</p>
        <p>Tem certeza disso?</p>
        <div className="mt-4 flex gap-4">
          <button
            className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-md grow"
            onClick={deleteExpense}
          >
            SIM
          </button>
          <button
            className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded-md grow"
            data-close={true}
          >
            NÃO
          </button>
        </div>
      </div>
    </section>
  );
}

export default DeleteExpense;
