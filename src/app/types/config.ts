import { z } from "zod";
import { User } from "firebase/auth";

/********************* CURRENT USER *************************/
export type userT = {
  user: User;
  getUser: (data: User) => void;
};

/********************* LOGIN FORM *************************/
export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Sua senha tem pelo menos 6 caracteres" }),
});

export type loginFormPropsT = z.infer<typeof loginFormSchema>;

/********************* SIGNUP FORM *************************/
export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Seu nome precisa ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
    password2: z.string(),
  })
  .refine((data) => data.password == data.password2, {
    path: ["password2"],
    message: "As senhas precisam ser iguais",
  });

export type signupFormProps = z.infer<typeof signupFormSchema>;

/********************* SIGNUP FORM *************************/
export const resetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

export type resetPasswordFormPropsT = z.infer<typeof resetPasswordFormSchema>;

/********************* EXPENSE FORM *************************/
export const expenseFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome da despesa precisa ter pelo menos 3 caracteres",
  }),
  value: z
    .number({
      required_error: "Adicione um valor",
    })
    .positive({
      message: "O valor pecisa ser maior do que zero",
    }),
  type: z.enum(["entrada", "saída"], { required_error: "Selecione uma tipo" }),
  date: z.string({ required_error: "Selecione uma data" }),
});

export type expenseFormProps = z.infer<typeof expenseFormSchema>;

/********************* HANDLE DATE *************************/
const dateSchema = z.object({
  year: z.number(),
  getYear: z.function().args(z.number()),
  month: z.number(),
  getMonth: z.function().args(z.number()),
});

export type selectDateT = z.infer<typeof dateSchema>;

/********************* EXPENSE DATA *************************/
const expensesDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  type: z.enum(["entrada", "saída"]),
  date: z.string(),
  user: z.string(),
});

export type expenseDataT = z.infer<typeof expensesDataSchema>;

const expenseSchema = z.object({
  creating: z.boolean(),
  setCreating: z.function().args(z.boolean()),
  deleting: z.boolean(),
  setDeleting: z.function().args(z.boolean()),
  editing: z.boolean(),
  setEditing: z.function().args(z.boolean()),
  expensesData: z.array(expensesDataSchema),
  getExpensesData: z.function().args(z.array(expensesDataSchema)),
  expensesByDate: z.array(expensesDataSchema),
  getExpensesByDate: z.function().args(z.array(expensesDataSchema)),
});

export type expenseStateT = z.infer<typeof expenseSchema>;
