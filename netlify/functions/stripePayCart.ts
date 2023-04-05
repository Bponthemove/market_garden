import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      lineItems: [{ price: "11", quantity: 2 }],
      successUrl: "http://localhost:3000/home",
      cancelUrl: "http://localhost:3000/home",
      mode: "payment",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: "topId",
      }),
    };
  } catch (err) {
    console.log(err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: "bottomId",
    }),
  };
};

export { handler };
