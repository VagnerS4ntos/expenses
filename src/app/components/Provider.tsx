"use client";
import React from "react";
import Header from "./Header";
import { ROUTE_PROTECTED_REGEX, getAllExpensesDatabase } from "@/utils/helpers";
import { usePathname } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useExpenses, useUser } from "@/states/config";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";

function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getUser, user } = useUser();
  const { getExpensesData, setFetchingExpenses } = useExpenses(
    (state) => state
  );

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user);
      } else {
        getUser({} as User);
      }
    });
  }, []);

  React.useEffect(() => {
    const expensesRef = collection(db, "allExpenses");
    if (user.uid) {
      const observer = onSnapshot(expensesRef, (snapshot) => {
        getAllExpensesDatabase(user.uid).then((data) => {
          getExpensesData(data);
          setFetchingExpenses(false);
        });
      });

      return () => observer();
    }
  }, [user]);

  return (
    <main>
      {ROUTE_PROTECTED_REGEX.test(pathname) && <Header />}
      {children}
    </main>
  );
}

export default Provider;
