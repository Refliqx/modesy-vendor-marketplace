import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
    }

    const secret = process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAADjILpMsBRJoX40a9iosqK0bd_A";

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    });

    const verifyData = await verifyRes.json();

    return NextResponse.json({
      success: !!verifyData.success,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
