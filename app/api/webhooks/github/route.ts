// import prisma from "@/db";

import app from "@/github";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    console.log("PAYLOAD RECEIVED (LARGE OBJECT)");

    let webhook = await app.webhooks.verifyAndReceive({
      id: request.headers.get("x-github-delivery") as any,
      name: request.headers.get("x-github-event") as any,
      signature: request.headers.get("x-hub-signature-256") as any,
      payload: body
    });

    console.log("webhook", webhook);

    let data = { success: true };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json"
      }
    });
  } catch (error: any) {
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
