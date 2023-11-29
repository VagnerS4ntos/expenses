import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseFormProps, expenseFormSchema } from '@/types/config';
import { useExpenses, useUser } from '@/states/config';
import { convertDateToFirestore, getInputDateFormat } from '@/utils/helpers';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { toast } from 'react-toastify';

function CreateExpense() {
	const { setCreating } = useExpenses((state) => state);
	const { user } = useUser((state) => state);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<expenseFormProps>({
		defaultValues: { date: getInputDateFormat() },
		resolver: zodResolver(expenseFormSchema),
	});

	const onSubmit: SubmitHandler<expenseFormProps> = async ({
		name,
		value,
		type,
		date,
	}) => {
		try {
			const user_id = user.uid;

			const expensesCollection = collection(db, user_id);
			await addDoc(expensesCollection, {
				name,
				type,
				value,
				date: convertDateToFirestore(date),
			});
			toast.success('Despesa criada com sucesso');
			setCreating(false);
		} catch (error) {
			toast.error('Algo deu errado ao criar a despesa');
			console.log(error);
		}
	};

	//Fecha a janela de criação de despesa
	function closeCreateExpense(event: any) {
		if (event.target.dataset.close) {
			setCreating(false);
		}
	}

	return (
		<section
			className="fixed inset-0 bg-white bg-opacity-60 grid place-items-center px-2"
			data-close={true}
			onClick={closeCreateExpense}
		>
			<form
				className="bg-zinc-900 p-4 rounded-md w-full sm:w-3/5 lg:w-1/2 lg:max-w-lg"
				onSubmit={handleSubmit(onSubmit)}
			>
				<p className="mb-2 text-2xl">NOVA DESPESA</p>
				<label htmlFor="name" className="block">
					Nome
				</label>
				<input
					type="text"
					id="name"
					autoFocus
					className={`mt-1 p-2 w-full border  rounded-md text-black ${
						errors.name && 'border-red-600'
					}`}
					{...register('name')}
				/>
				<span className="text-red-500 text-sm">{errors.name?.message}</span>

				<label htmlFor="value" className="block mt-4">
					Valor
				</label>
				<input
					type="text"
					id="value"
					className={`mt-1 p-2 w-full border rounded-md text-black ${
						errors.value && 'border-red-600'
					}`}
					{...register('value')}
				/>
				<span className="text-red-500 text-sm">{errors.value?.message}</span>

				<label htmlFor="type" className="block mt-4">
					Tipo
				</label>
				<select
					id="type"
					className={`mt-1 p-2 w-full border rounded-md text-black ${
						errors.type && 'border-red-600'
					}`}
					{...register('type')}
				>
					<option value="saída">Saída</option>
					<option value="entrada">Entrada</option>
				</select>
				<span className="text-red-500 text-sm">{errors.type?.message}</span>

				<label htmlFor="date" className="block mt-4">
					Data
				</label>

				<input
					type="date"
					id="date"
					className={`mt-1 p-2 w-full border rounded-md text-black ${
						errors.date && 'border-red-600'
					}`}
					{...register('date')}
				/>
				<span className="text-red-500 text-sm">{errors.date?.message}</span>

				<div className="flex gap-4 mt-4">
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md"
					>
						Salvar
					</button>
					<button
						type="submit"
						className="w-full bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-md"
						data-close={true}
					>
						Cancelar
					</button>
				</div>
			</form>
		</section>
	);
}

export default CreateExpense;
