import { HandlerContext, HandlerEvent } from "@netlify/functions";

const stripe = require("stripe")(process.env.VITE_APP_STRIPE_SECRET_KEY);

const handler = async (event: HandlerEvent, context: HandlerContext) => {
  const checkOut = event.body != null ? JSON.parse(event.body) : "";
  let session: any;
  let status: number;
  if (checkOut.items) {
    const { email, couponId, items } = checkOut;

    const modifiedLineItems = items.map(
      (item: { quantity: number; id: string; price: number }) => ({
        price_data: {
          product: item.id,
          currency: "gbp",
          unit_amount_decimal: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    let checkoutObject = {
      mode: "payment",
      line_items: modifiedLineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: checkOut.shipping
              ? "Delivery cost"
              : " Free Delivery",
            fixed_amount: {
              amount: checkOut.shipping ? 399 : 0,
              currency: "gbp",
            },
          },
        },
      ],
      success_url: "https://roundthefield.co.uk/afterstripe/success",
      // cancel_url: "https://roundthefield.co.uk/cart",
      cancel_url: "https://roundthefield.co.uk/afterstripe/failed",
      customer_email: email,
    };

    if (couponId) {
      // add coupon to Stripe dashboard, add coupon id to user in db
      checkoutObject = {
        ...checkoutObject,
        // @ts-ignore: Unreachable code error
        discounts: [
          {
            coupon: couponId,
          },
        ],
      };
    }

    try {
      session = await stripe.checkout.sessions.create(checkoutObject);
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
