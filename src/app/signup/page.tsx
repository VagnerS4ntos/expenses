"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { signupFormProps, signupFormSchema } from "../../types/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/client";
import { setCookie } from "cookies-next";

function SignUp() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<signupFormProps>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit: SubmitHandler<signupFormProps> = ({
    name,
    email,
    password,
  }) => {
    setRequesting(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const idToken = await user.getIdToken();
        fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            updateProfile(user, {
              displayName: name,
            }).then(() => {
              router.push("/");
            });
          }
        });
      })
      .catch((error) => {
        console.log(error.message);
        setRequesting(false);
      });
  };

  return (
    <section className="flex justify-center items-center h-screen px-4">
      <div className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Cadastro</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">
              Nome
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nome"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("name")}
            />
            <span className="text-red-500 text-sm">{errors.name?.message}</span>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              placeholder="E-mail"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("email")}
            />
            <span className="text-red-500 text-sm">
              {errors.email?.message}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("password")}
            />
            <span className="text-red-500 text-sm">
              {errors.password?.message}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="password2" className="block font-medium">
              Repita a senha
            </label>
            <input
              type="password"
              id="password2"
              placeholder="Senha"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("password2")}
            />
            <span className="text-red-500 text-sm">
              {errors.password2?.message}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded-md  h-10 flex justify-center items-center"
            disabled={requesting}
          >
            {requesting ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2">
          <Link href="login" className="text-blue-600 hover:text-blue-800">
            Já tem conta? Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
