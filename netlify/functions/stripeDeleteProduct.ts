import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const id = event?.queryStringParameters?.id;
  let response = 'oeps';
  if (id){
    try {
      response = await stripe.products.del(id);
    } catch (err) {
      console.log(err);
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
