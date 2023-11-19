import React from "react";
import Image from "next/image";
import Link from "next/link";
import { VscSignOut } from "react-icons/vsc";
import { RiUserSettingsFill } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useSelectDate, useUser } from "@/states/config";

function Header() {
  const router = useRouter();
  const { getMonth, getYear } = useSelectDate((state) => state);
  const { user } = useUser((state) => state);

  function logOut() {
    signOut(auth)
      .then(() => {
        deleteCookie("accessToken");
        deleteCookie("uid");
        getYear(new Date().getFullYear());
        getMonth(new Date().getMonth());
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <header className="bg-gradient-to-r from-white to-green-600 fixed w-full h-16 flex items-center">
      <nav className="container flex items-center justify-between text-2xl">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Link>

        <ul className="flex items-center gap-2 text-black">
          <li>
            <span className="text-xl">{user.displayName}</span>
          </li>
          <li className="cursor-pointer hover:text-white">
            <Link href="/settings">
              <RiUserSettingsFill />
            </Link>
          </li>
          <li className="cursor-pointer hover:text-white" onClick={logOut}>
            <VscSignOut />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
