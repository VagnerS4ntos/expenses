"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loginFormSchema, loginFormPropsT } from "@/types/config";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useUser } from "@/states/config";

function Reauthenticate({
  setReauthenticateRequired,
}: {
  setReauthenticateRequired: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");
  const { user } = useUser((state) => state);

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
    const credendital = EmailAuthProvider.credential(email, password);

    reauthenticateWithCredential(user, credendital)
      .then(() => {
        setReauthenticateRequired(false);
        setRequesting(false);
      })
      .catch((error) => {
        if (error.message == "Firebase: Error (auth/user-mismatch).") {
          setError("Senha ou e-mail incorreto");
        } else {
          console.log(error.message);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xl mb-4 text-yellow-500">
        Você precisa se reautenticar!
      </p>
      <div className="mb-4">
        <label htmlFor="email" className="block font-medium">
          E-mail
        </label>
        <input
          type="text"
          id="email"
          placeholder="E-mail"
          className={`mt-1 p-2 w-full border  rounded-md text-black ${
            errors.email ? "border-red-500" : "border-gray-400"
          }`}
          {...register("email")}
        />
        <span className="text-red-500 text-sm">{errors.email?.message}</span>
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block font-medium">
          Senha
        </label>
        <input
          type="password"
          id="password"
          placeholder="Senha"
          className={`mt-1 p-2 w-full border  rounded-md text-black ${
            errors.password ? "border-red-500" : "border-gray-400"
          }`}
          {...register("password")}
        />

        <span className="text-red-500 text-sm">{errors.password?.message}</span>
      </div>

      <>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md flex items-center justify-center h-10"
          disabled={requesting}
        >
          {requesting ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Reautenticar"
          )}
        </button>
        <span className="text-red-500 text-sm">{error}</span>
      </>
    </form>
  );
}

export default Reauthenticate;
