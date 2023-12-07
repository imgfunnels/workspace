import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findFirst({ where: { email } });

    return new Response(JSON.stringify({ success: true, user }), {
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
