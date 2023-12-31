"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loginFormSchema, loginFormPropsT } from "@/types/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import GoogleLogin from "../components/login/GoogleLogin";

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
      .then(async ({ user }) => {
        const idToken = await user.getIdToken();

        fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/login`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            router.push("/");
          }
        });
      })
      .catch((error) => {
        if (
          error.message == "Firebase: Error (auth/wrong-password)." ||
          error.message == "Firebase: Error (auth/user-not-found)."
        ) {
          setError("E-mail ou senha incorreta");
        } else {
          setError(error.message);
        }
        setRequesting(false);
      });
  };

  return (
    <section className="flex justify-center items-center h-screen px-4">
      <div className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              placeholder="E-mail"
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
              placeholder="Senha"
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

        <GoogleLogin />

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href="/signup"
            className="w-fit text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </Link>
          <Link
            href="/forgotPassword"
            className="sm:text-right w-fit sm:ml-auto text-blue-600 hover:text-blue-800"
          >
            Esqueci a senha
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
