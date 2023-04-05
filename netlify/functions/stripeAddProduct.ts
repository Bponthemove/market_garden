import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

const handler: Handler = async( 
  event: HandlerEvent,
  context: HandlerContext
) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode,
      headers,
      body: "This was not a POST request!"
    };
  }

  // // Parse the body contents into an object.
  // const data = event.body ? JSON.parse(event.body) : {};

  // // Make sure we have all required data. Otherwise, get outta here.
  // if (!data.token || !data.amount || !data.idempotency_key) {
  //   const message = "Required information is missing!";

  //   console.error(message);

  //   return {
  //     statusCode,
  //     headers,
  //     body: JSON.stringify({
  //       status: "failed",
  //       message
  //     })
  //   };
  // }
  const params = event?.queryStringParameters ?? {};
  const {id, price, name} = params;
  
  let response = 'oeps';
  if (id && price && name) {
    try {
      response = await stripe.products.create({
        id,
        name,
        default_price_data: {
          currency: 'gbp',
          unit_amount_decimal: Number(price) * 100
        }
      });
    } catch (err) {
      console.log(err)
      return {
        statusCode: 424,
        headers,
        body: JSON.stringify({
          status: "failed",
          message: err.message
        })
      }
    }
  }
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      statusCode: 200,
      status: response,
      message: "Product successfully added!"
    })
  };
};

export {handler};
