"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { updateNameFormPropsT, updateNameFormSchema } from "@/types/config";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function UpdateName() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updateNameFormPropsT>({
    resolver: zodResolver(updateNameFormSchema),
  });

  const onSubmit: SubmitHandler<updateNameFormPropsT> = async ({ name }) => {
    setRequesting(true);
    updateProfile(auth.currentUser!, {
      displayName: name,
    })
      .then(() => {
        router.refresh();
        setValue("name", "");
        toast.success("Nome atualizado com sucesso!");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setRequesting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium">
          Nome
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nome"
          className={`mt-1 p-2 w-full border  rounded-md text-black ${
            errors.name ? "border-red-500" : "border-gray-400"
          }`}
          {...register("name")}
        />
        <span className="text-red-500 text-sm">{errors.name?.message}</span>
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
  );
}

export default UpdateName;
