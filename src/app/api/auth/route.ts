import { firebase } from "@/firebase/admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authorization = headers().get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
      const accessToken = authorization.split("Bearer ")[1];
      if (accessToken) {
        const user = await firebase.auth().verifyIdToken(accessToken);
        if (user) {
          return NextResponse.json({ status: 200 });
        }
        console.log("Usuário deslogado");
        return NextResponse.json({ status: 401 });
      } else {
        console.log("Token inválido");
        return NextResponse.json({ status: 401 });
      }
    } else {
      console.log("Token inexistente");
      return NextResponse.json({ status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ status: 401 });
  }
}
