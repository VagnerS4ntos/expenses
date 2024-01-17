import React from 'react';
import { convertNumberToCurrency } from '@/utils/helpers';
import { GrMoney } from 'react-icons/gr';
import { useExpenses } from '@/states/config';

function Balance() {
	const [showBalance, setShowBalance] = React.useState(false);
	const { expensesByDate } = useExpenses((state) => state);

	//Soma dos valores que entraram
	const inflows = expensesByDate
		.filter((expense) => expense.type == 'entrada')
		.reduce((acc, expense) => acc + Number(expense.value.replace(',', '.')), 0);

	//Soma dos valores que saíram
	const expenses = expensesByDate
		.filter((expense) => expense.type == 'saída')
		.reduce((acc, expense) => acc + Number(expense.value.replace(',', '.')), 0);

	//Cálculo do saldo
	const balance = inflows - expenses;

	return (
		<>
			<div
				className="flex items-center gap-2 border p-2 rounded-md cursor-pointer w-fit hover:bg-white hover:text-black"
				onClick={() => setShowBalance(!showBalance)}
			>
				<GrMoney /> {showBalance ? 'Ocultar saldos' : 'Mostrar saldos'}
			</div>
			{showBalance && (
				<section className="sm:flex sm:justify-between sm:space-y-0 space-y-4 uppercase mt-4 border-b pb-10">
					<div
						className={`${
							balance < 0 ? 'bg-red-600' : 'bg-green-600'
						} p-2 rounded-md shadow-md shadow-white`}
					>
						Saldo: {convertNumberToCurrency(balance)}
					</div>
					<div className=" p-2 rounded-md shadow-md shadow-green-600">
						Entradas: {convertNumberToCurrency(inflows)}
					</div>

					<div className="p-2 rounded-md shadow-md shadow-red-600">
						Saídas: {convertNumberToCurrency(expenses)}
					</div>
				</section>
			)}
		</>
	);
}

export default Balance;
