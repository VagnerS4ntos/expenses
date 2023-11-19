import React from "react";
import {
  useExpenses,
  useOrderBy,
  useSelectDate,
  useUser,
} from "@/states/config";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  convertNumberToCurrency,
  getAllExpensesDatabase,
  getExpensesDatabaseByDate,
  convertDate,
} from "@/utils/helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { expenseDataT } from "@/types/config";
import Paginate from "../Paginate";
import DeleteExpense from "./DeleteExpense";
import EditExpense from "./EditingExpense";
import OrderBy from "./OrderBy";
import { Reorder } from "framer-motion";

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
  const { orderBy } = useOrderBy((state) => state);
  const [loading, setLoading] = React.useState(true);
  const { user } = useUser((state) => state);
  const { month, year } = useSelectDate((state) => state);
  const [deleteExpenseId, setDeleteExpenseId] = React.useState("");
  const [editExpenseData, setEditExpenseData] = React.useState<expenseDataT[]>(
    []
  );

  //Dados da paginação
  const [currentPage, setCurrentPage] = React.useState(1);
  const expensesPerPege = 10;
  const lastIndex = currentPage * expensesPerPege;
  const firstIndex = lastIndex - expensesPerPege;
  const [slicedExpenses, setSlicedExpenses] = React.useState<expenseDataT[]>(
    []
  );

  //Paga todas as despesas do usuário
  React.useEffect(() => {
    if (user.uid) {
      getAllExpensesDatabase(user.uid)
        .then((data) => {
          getExpensesData(data);
        })
        .then(() => setLoading(false));
    }
  }, [user]);

  //Pega as despesas por dada e também divide para a paginação
  React.useEffect(() => {
    const expenseRenderData = getExpensesDatabaseByDate(
      expensesData,
      year,
      month
    );

    expenseRenderData.sort((a, b) =>
      a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0
    );

    const slicedExpensesData = expenseRenderData.slice(firstIndex, lastIndex);
    setSlicedExpenses(slicedExpensesData);
    getExpensesByDate(expenseRenderData);
  }, [month, year, expensesData, currentPage, orderBy]);

  //Abre a janela para deletar despesa
  function deletingExpense(event: any) {
    const { id } = event.target.closest("[data-id]").dataset;
    setDeleteExpenseId(id);
    setDeleting(true);
  }

  //Abre a janela para editar despesa
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
        <section className="overflow-x-auto">
          <OrderBy />
          <Reorder.Group values={slicedExpenses} onReorder={setSlicedExpenses}>
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
                <>
                  {slicedExpenses.map(({ id, name, value, date, type }) => (
                    <Reorder.Item
                      as="tr"
                      key={id}
                      data-id={id}
                      value={slicedExpenses}
                      drag={false}
                    >
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
                        <div className="flex justify-center items-center gap-2 sm:gap-5 lg:gap-8">
                          <span
                            className="cursor-pointer"
                            onClick={deletingExpense}
                          >
                            🗑️
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={editingExpense}
                          >
                            ✏️
                          </span>
                        </div>
                      </td>
                    </Reorder.Item>
                  ))}
                </>
              </tbody>
            </table>
          </Reorder.Group>
        </section>
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
