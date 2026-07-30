import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import Stripe from "stripe";

// Stripe stuurt hier een event zodra een betaling is voltooid.
// Wij maken dan pas de 'enrollment' aan - zo kan niemand toegang krijgen zonder te betalen.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Ongeldige webhook-handtekening" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      const supabase = createServiceClient();
      await supabase.from("enrollments").upsert(
        {
          user_id: userId,
          course_id: courseId,
          stripe_payment_id: session.payment_intent as string
        },
        { onConflict: "user_id,course_id" }
      );
    }
  }

  return NextResponse.json({ received: true });
}
