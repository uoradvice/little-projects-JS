const order = {
    id: "order-123",
    productId: "phone-42",
    quantity: 1,
    amount: 59999
};

async function processOrder(order) {
    const result = {
        reservationId: null,
        paymentId: null,
        shipmentId: null,
        success: false
    };

    let isCharged = false;

    try {
        await sleep(200);
        result.reservationId = await reserveProduct(order);

        await sleep(200);
        result.paymentId = await chargePayment(order);
        isCharged = true;

        await sleep(200);
        result.shipmentId = await createShipment(order);

        result.success = true;
    } catch (error) {
        console.error(
            `[ERROR]\t${error.name}: ${error.message}`
        );

        if (isCharged) {
            try {
                await refundPayment(result.paymentId);
                console.log("[WARN]\tChargeback completed");
            } catch (refundError) {
                console.error(
                    `[ERROR]\tRefund failed: ${refundError.message}`
                );
            }
        }

        throw error;
    } finally {
        console.log("[INFO]\tOrder process finished");

        try {
            await sleep(500);
            await releaseResources(order);
        } catch (cleanupError) {
            console.error(
                `[ERROR]\tCleanup failed: ${cleanupError.message}`
            );
        }
    }

    return result;
}


async function reserveProduct(order) {
    // throw new Error("'Can not reserve product'"); //Artificial Error
    console.log("[INFO]\tItem reserved.");
    return "reservation-1";
}

async function chargePayment(order) {
    // throw new Error("'Can not charge payment'"); //Artificial Error
    console.log("[INFO]\tCharged payment.");
    return "payment-1";
}

async function createShipment(order) {
    // throw new Error("'Can not create shipment'"); //Artificial Error
    console.log("[INFO]\tShipment created.");
    return "shipment-1";
}

async function releaseResources(order) {
    console.log(`[INFO]\tResources released for order ${order.id}`);
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function refundPayment(paymentId) {
    console.log(`[INFO]\tRefund payment: ${paymentId}`);
}

try {
    const orderResult = await processOrder(order);
    console.log("Order result:", orderResult);
} catch (error) {
    console.error("Order processing failed:", error.message);
} finally {
    console.log("End of the program");
}