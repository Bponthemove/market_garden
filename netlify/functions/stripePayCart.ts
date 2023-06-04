import { HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_SECRET_KEY);

const handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  console.log({stripe})
  console.log({context})
  console.log({event})
  const checkOut = JSON.parse(event.body ?? '');
  let session: any;
  let status: number;
  if (checkOut.items) {
    const modifiedLineItems = checkOut.items.map((item: { quantity: number; id: string; price: number; }) => ({
      price_data:{
        product: item.id,
        currency: 'gbp',
        unit_amount_decimal: Number(item.price) * 100
      },
      quantity: item.quantity
    }))
    try {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: modifiedLineItems,
        success_url: "http://localhost:8888/afterstripe/success",
        cancel_url: "http://localhost:8888/afterstripe/failed",
        customer_email: checkOut.email,
      });
      status = 200;      
    } catch (err) {
      console.log(err);
      status = 400
      session = {
        message: err
      }
    }
    return {
      statusCode: status, 
      body: JSON.stringify(session),
    };
  }
};

export { handler };
