import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_SECRET_KEY);

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const id = event?.queryStringParameters?.id;
  let response = "oeps";
  if (id) {
    try {
      response = await stripe.products.update(id, {
        active: false,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      response,
    }),
  };
};

export { handler };
