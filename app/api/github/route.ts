import prisma from "@/db";

import app from "@/github";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { AuthOptions } from "@/auth/options";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  // Do not wrap the above in a try block

  try {
    console.log(searchParams);

    const session = await getServerSession(AuthOptions);

    console.log("Session", session);

    const installationId = parseInt(
      searchParams.get("installation_id") as string
    ) as number;

    const code = searchParams.get("code") as string;

    const token = await app.oauth.createToken({ code });

    console.log("TOKEN", token);

    prisma.refreshToken.create({ data: token.authentication });

    return NextResponse.redirect(
      new URL("https://dashboard.imgfunnels.com?success=true&message=Success")
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
}
