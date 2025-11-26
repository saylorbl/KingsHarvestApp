import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { name, email, amount, paymentMethodId } = body;

        if (!name || !email || !amount) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }

        //Create or retrieve customer
        let customer;
        const existingCustomer = await stripe.customers.list({
            email,
        });

        if (existingCustomer.data.length > 0) {
            customer = existingCustomer.data[0];
        } else {
            const newCustomer = await stripe.customers.create({
                name,
                email,
            });

            customer = newCustomer;
        }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: "2024-06-20" },
        );

        //Attach payment method to customer (for saving cards)
        if (paymentMethodId) {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id,
            })
        }

        //Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount) * 100,
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            //DO NOT include 'confirm: true' here
        });

        return new Response(
            JSON.stringify({
                paymentIntent: paymentIntent,
                ephemeralKey: ephemeralKey,
                customer: customer.id,
            }),
        );
    }catch(error){
        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                status: 500
            })
        );
    }
}