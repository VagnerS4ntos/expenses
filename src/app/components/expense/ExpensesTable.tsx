import React from "react";
import { useExpenses, useSelectDate, useUser } from "@/states/config";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  convertNumberToCurrency,
  getAllExpensesDatabase,
  getExpensesDatabaseByDate,
  convertDate,
} from "@/utils/helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { expenseDataT } from "@/app/types/config";
import Paginate from "../Paginate";
import DeleteExpense from "./DeleteExpense";
import EditExpense from "./EditingExpense";

function ExpensesTable() {
  const {
    expensesData,
    getExpensesData,
    getExpensesByDate,
    expensesByDate,
    setDeleting,
    deleting,
    editing,
    setEditing,
  } = useExpenses((state) => state);
  const [loading, setLoading] = React.useState(true);
  const { user } = useUser((state) => state);
  const { month, year } = useSelectDate((state) => state);
  const [deleteExpenseId, setDeleteExpenseId] = React.useState("");
  const [editExpenseData, setEditExpenseData] = React.useState<expenseDataT[]>(
    []
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const expensesPerPege = 10;
  const lastIndex = currentPage * expensesPerPege;
  const firstIndex = lastIndex - expensesPerPege;
  const [slicedExpenses, setSlicedExpenses] = React.useState<expenseDataT[]>(
    []
  );

  React.useEffect(() => {
    if (user.uid) {
      getAllExpensesDatabase(user.uid)
        .then((data) => {
          getExpensesData(data);
        })
        .then(() => setLoading(false));
    }
  }, [user]);

  React.useEffect(() => {
    const expenseRenderData = getExpensesDatabaseByDate(
      expensesData,
      year,
      month
    );
    const slicedExpensesData = expenseRenderData.slice(firstIndex, lastIndex);
    setSlicedExpenses(slicedExpensesData);
    getExpensesByDate(expenseRenderData);
  }, [month, year, expensesData, currentPage]);

  function deletingExpense(event: any) {
    const { id } = event.target.closest("[data-id]").dataset;
    setDeleteExpenseId(id);
    setDeleting(true);
  }

  function editingExpense(event: any) {
    const { id } = event.target.closest("[data-id]").dataset;
    const data = expensesByDate.filter((expense) => expense.id == id);
    setEditExpenseData(data);

    setEditing(true);
  }

  if (loading)
    return (
      <AiOutlineLoading3Quarters size="2em" className="animate-spin mt-10 " />
    );

  return (
    <>
      {slicedExpenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="border table-auto w-full mt-4">
            <thead>
              <tr className="bg-gray-200 text-black uppercase text-sm">
                <th className={`px-4 py-2 `}>Nome</th>
                <th className={`px-4 py-2 `}>Valor</th>
                <th className={`px-4 py-2 `}>Data</th>
                <th className={`px-4 py-2 `}>Ações</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {slicedExpenses.map(({ id, name, value, date, type }) => (
                <tr key={id} className={`border`} data-id={id}>
                  <td className={`px-4 py-2 text-center border relative`}>
                    {name}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border font-bold ${
                      type == "saída" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {convertNumberToCurrency(value)}
                  </td>
                  <td className={`px-4 py-2 text-center border`}>
                    {convertDate(date)}
                  </td>
                  <td className={`px-4 py-2 text-center border`}>
                    <span className="flex justify-center items-center gap-2 sm:gap-5 lg:gap-8">
                      <MdDelete
                        size="1.5em"
                        className="text-red-600 cursor-pointer"
                        onClick={deletingExpense}
                      />
                      <MdEdit
                        size="1.5em"
                        className="text-purple-600 cursor-pointer"
                        onClick={editingExpense}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4">Nenhum dado encontrado</p>
      )}

      {expensesByDate.length > expensesPerPege && (
        <Paginate
          dataLength={expensesByDate.length}
          dataPerPage={expensesPerPege}
          setCurrentPage={setCurrentPage}
        />
      )}

      {deleting && <DeleteExpense id={deleteExpenseId} />}
      {editing && <EditExpense editExpenseData={editExpenseData} />}
    </>
  );
}

export default ExpensesTable;
