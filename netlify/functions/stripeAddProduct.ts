import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_SECRET_KEY);

const statusCode = 400;

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode,
      body: "This was not a POST request!",
    };
  }

  const params = event?.queryStringParameters ?? {};

  const paramsInArray = Object.keys(params);

  const requiredParams = ["id", "price", "name"];

  const paramsPresent = requiredParams.filter((param) =>
    paramsInArray.includes(param)
  );

  if (paramsPresent.length !== requiredParams.length) {
    return {
      statusCode,
      body: `The following params are missing: ${requiredParams.reduce(
        (string, param) => {
          if (!paramsPresent.includes(param)) {
            string = string + " " + param;
          }
          return string;
        },
        ""
      )}`,
    };
  }

  const { id, price, name } = params;
  
  try {
    const product = await stripe.products.create({
      id,
      name,
      default_price_data: {
        currency: "gbp",
        unit_amount_decimal: Math.ceil(parseFloat(price!) * 100),
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        product,
        message: "succeeded",
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 424,
      body: JSON.stringify({
        product: {},
        message: err.message ?? "ERROR",
      }),
    };
  }
};

export { handler };
