"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { updateEmailFormPropsT, updateEmailFormSchema } from "@/types/config";
import { updateEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "react-toastify";
import Reauthenticate from "./Reauthenticate";

function UpdateEmail() {
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [reauthenticateRequired, setReauthenticateRequired] =
    React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updateEmailFormPropsT>({
    resolver: zodResolver(updateEmailFormSchema),
  });

  const onSubmit: SubmitHandler<updateEmailFormPropsT> = async ({ email }) => {
    setRequesting(true);
    updateEmail(auth.currentUser!, email)
      .then(() => {
        setValue("email", "");
        toast.success("E-mail atualizado com sucesso!");
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
            <label htmlFor="email" className="block font-medium">
              Novo e-mail
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

export default UpdateEmail;
