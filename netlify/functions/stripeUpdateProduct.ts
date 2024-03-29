import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  let response;
  try {
    response = await stripe.products.update("prod_NeYFHWpkmM28Jr", {
      metadata: { order_id: "6735" },
    });
  } catch (err) {
    console.error(err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      response,
    }),
  };
};

export { handler };
