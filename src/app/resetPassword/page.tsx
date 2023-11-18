"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  resetPasswordFormPropsT,
  resetPasswordFormSchema,
} from "../types/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "react-toastify";

function ResetPassword() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<resetPasswordFormPropsT>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit: SubmitHandler<resetPasswordFormPropsT> = async ({
    email,
  }) => {
    setRequesting(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setValue("email", "");
        toast.success(
          "Um e-mail foi enviado. Verifique sua caixa de entrada ou lixo eletrônico"
        );
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setRequesting(false);
      });
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen px-4">
      <div className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Resetar senha</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              className={`mt-1 p-2 w-full border  rounded-md ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
              {...register("email")}
            />
            <span className="text-red-500 text-sm">
              {errors.email?.message}
            </span>
          </div>

          <>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded-md flex items-center justify-center h-10"
              disabled={requesting}
            >
              {requesting ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Enviar"
              )}
            </button>
            <span className="text-red-500 text-sm">{error}</span>
          </>
        </form>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href="/login"
            className="w-fit text-blue-600 hover:text-blue-800"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="sm:text-right w-fit sm:ml-auto text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
