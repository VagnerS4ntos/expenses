"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loginFormSchema, loginFormPropsT } from "../types/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { setCookie } from "cookies-next";

function Login() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormPropsT>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<loginFormPropsT> = async ({
    email,
    password,
  }) => {
    setRequesting(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user: any = userCredential.user;
        if (user) {
          setCookie("accessToken", user.accessToken, { maxAge: 604800 });
          router.push("/");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setRequesting(false);
      });
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen px-4">
      <section className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
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

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={`mt-1 p-2 w-full border  rounded-md ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
              {...register("password")}
            />

            <span className="text-red-500 text-sm">
              {errors.password?.message}
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
                "Entrar"
              )}
            </button>
            <span className="text-red-500 text-sm">{error}</span>
          </>
        </form>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href="signup"
            className="w-fit text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </Link>
          <Link
            href="resetPassword"
            className="sm:text-right w-fit sm:ml-auto text-blue-600 hover:text-blue-800"
          >
            Esqueci a senha
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
