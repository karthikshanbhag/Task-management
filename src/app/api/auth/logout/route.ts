import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({message: "Logged Out SuccessFully"}, {status: 201})

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response

}
