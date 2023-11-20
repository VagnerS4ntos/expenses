import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";
import Reauthenticate from "./Reauthenticate";
import { deleteUser } from "firebase/auth";
import { useSelectDate, useUser } from "@/states/config";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteCookie } from "cookies-next";

function DeleteAccount() {
  const router = useRouter();
  const { user } = useUser((state) => state);
  const { getMonth, getYear } = useSelectDate((state) => state);
  const [requesting, setRequesting] = React.useState(false);
  const [reauthenticateRequired, setReauthenticateRequired] =
    React.useState(false);

  const [error, setError] = React.useState("");

  function closeDeletingAccount(event: any) {
    if (event.target.dataset.close) {
      setRequesting(false);
      setReauthenticateRequired(false);
    }
  }

  function requestDeleteAccount() {
    setRequesting(true);
    setReauthenticateRequired(true);
  }

  function deleteAccount() {
    deleteUser(user)
      .then(async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/signout`,
          {
            method: "POST",
          }
        );

        if (response.status === 200) {
          toast.success("Sua conta foi deletada com sucesso!");
          getYear(new Date().getFullYear());
          getMonth(new Date().getMonth());
          router.push("/login");
        }
      })
      .catch((error) => {
        if (error.message == "Firebase: Error (auth/requires-recent-login).") {
          setReauthenticateRequired(true);
          toast.info("Você precisa se reautenticar antes");
          setRequesting(false);
        } else {
          setError(error.message);
          toast.error("Algo deu errado");
        }
      });
  }

  return (
    <section className="max-w-lg mt-4">
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded-md flex items-center justify-center h-10 mb-10"
        disabled={requesting}
        onClick={requestDeleteAccount}
      >
        {requesting ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          "Deletar minha conta"
        )}
      </button>

      {requesting && (
        <section
          className="bg-white bg-opacity-60 fixed inset-0 grid place-items-center px-2"
          data-close={true}
          onClick={closeDeletingAccount}
        >
          <div className="bg-zinc-900 p-6 rounded-md max-w-sm w-1/2 min-w-max">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
            <p className="mb-2 text-2xl">DELETAR CONTA</p>
            {reauthenticateRequired && (
              <Reauthenticate
                setReauthenticateRequired={setReauthenticateRequired}
              />
            )}

            {requesting && !reauthenticateRequired && (
              <>
                <p>Tem certeza disso?</p>
                <p>Isso não poderá ser desfeito</p>
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-md grow"
                    onClick={deleteAccount}
                  >
                    SIM
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded-md grow"
                    data-close={true}
                  >
                    NÃO
                  </button>
                </div>
              </>
            )}

            <span className="text-red-500 text-sm">{error}</span>
          </div>
        </section>
      )}
    </section>
  );
}

export default DeleteAccount;
