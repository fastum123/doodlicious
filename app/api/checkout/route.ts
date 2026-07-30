import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

// Start een Stripe Checkout sessie (eenmalige betaling, iDEAL + kaart) voor een cursus.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const courseId = formData.get("courseId") as string;

  const { data: course } = await supabase
    .from("courses")
    .select("id, titel, prijs_cent")
    .eq("id", courseId)
    .single();

  if (!course) return NextResponse.json({ error: "Cursus niet gevonden" }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "ideal"],
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: course.prijs_cent,
          product_data: { name: course.titel }
        },
        quantity: 1
      }
    ],
    metadata: { userId: user.id, courseId: course.id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cursussen/${course.id}?betaald=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cursussen/${course.id}`
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
