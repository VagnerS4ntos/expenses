"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  updatePasswordFormPropsT,
  updatePasswordFormSchema,
} from "@/types/config";
import { updatePassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "react-toastify";
import Reauthenticate from "./Reauthenticate";
import { useUser } from "@/states/config";

function UpdatePassword() {
  const { user } = useUser((state) => state);
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [reauthenticateRequired, setReauthenticateRequired] =
    React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updatePasswordFormPropsT>({
    resolver: zodResolver(updatePasswordFormSchema),
  });

  const onSubmit: SubmitHandler<updatePasswordFormPropsT> = async ({
    password,
  }) => {
    setRequesting(true);
    updatePassword(auth.currentUser!, password)
      .then(() => {
        setValue("password", "");
        setValue("password2", "");
        toast.success("Senha atualizado com sucesso!");
      })
      .then(async () => {
        const idToken = await user.getIdToken();

        //Chamei a função de login porque o Firebase revoga o cookie de sessão quando a senha do usuário é alterada
        fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/login`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      })
      .catch((error) => {
        if (error.message == "Firebase: Error (auth/requires-recent-login).") {
          setReauthenticateRequired(true);
          toast.info("Você precisa se reautenticar antes");
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setRequesting(false);
      });
  };

  return (
    <section className="max-w-lg">
      {reauthenticateRequired ? (
        <Reauthenticate setReauthenticateRequired={setReauthenticateRequired} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Nova senha
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
            <span className="text-red-500 text-sm">
              {errors.password?.message}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="password2" className="block font-medium">
              Repita a nova senha
            </label>
            <input
              type="password"
              id="password2"
              placeholder="Senha"
              className={`mt-1 p-2 w-full border  rounded-md text-black ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
              {...register("password2")}
            />
            <span className="text-red-500 text-sm">
              {errors.password2?.message}
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
                "Atualizar"
              )}
            </button>
            <span className="text-red-500 text-sm">{error}</span>
          </>
        </form>
      )}
    </section>
  );
}

export default UpdatePassword;
