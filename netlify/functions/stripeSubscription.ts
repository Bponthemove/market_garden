import { HandlerContext, HandlerEvent } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_SECRET_KEY);

const handler = async (event: HandlerEvent, context: HandlerContext) => {
  const checkOut = event.body != null ? JSON.parse(event.body) : '';
  let session: any;
  let status: number;
  if (checkOut.items) {
    try {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            quantity: 1,
            price: 2.99,
          },
        ],
        success_url: "https://roundthefield.co.uk/afterstripe/success",
        cancel_url: "https://roundthefield.co.uk//afterstripe/failed",
        customer_email: checkOut.email,
      });
      status = 200;
    } catch (err) {
      console.error(err);
      status = 400;
      session = {
        message: err,
      };
    }
    return {
      statusCode: status,
      body: JSON.stringify(session),
    };
  }
};

export { handler };
