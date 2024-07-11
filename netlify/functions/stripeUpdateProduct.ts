import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  let response = "Error updating in Stripe api";
  let statusCode = 400;

  const params = event?.queryStringParameters ?? {};

  const canUpdateName = params.id && params.name;
  const canUpdatePrice = params.priceId && params.price;

  if (canUpdatePrice || canUpdateName) {
    try {
      if (canUpdateName) {
        response = await stripe.products.update(params.id, {
          name: params.name,
        });
      }
      if (canUpdatePrice) {
        response = await stripe.products.update(params.id, {
          name: params.name,
        });
      }
      response = "product updated successfully";
      statusCode = 200;
    } catch (err) {
      console.error(err);
      response = `Error updating in Stripe api ${err}`;
      statusCode = 400;
    }
  }
  return {
    statusCode,
    body: JSON.stringify({
      response,
    }),
  };
};

export { handler };
