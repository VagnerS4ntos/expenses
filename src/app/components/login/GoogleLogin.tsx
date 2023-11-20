"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/client";

function GoogleLogin() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");

  const provider = new GoogleAuthProvider();

  function login() {
    setRequesting(true);

    signInWithPopup(auth, provider)
      .then(async ({ user }) => {
        const idToken = await user.getIdToken();

        fetch("/api/login", {
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
        setError(error.message);
        setRequesting(false);
      });
  }

  return (
    <>
      <button
        type="submit"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-md flex items-center justify-center h-10 mt-2"
        disabled={requesting}
        onClick={login}
      >
        {requesting ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <>
            <FcGoogle size="1.6em" />
            <span className="ml-2">Entre com o Google</span>
          </>
        )}
      </button>
      <span className="text-red-500 text-sm">{error}</span>
    </>
  );
}

export default GoogleLogin;
