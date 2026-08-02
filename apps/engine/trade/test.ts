import { OrderBook } from "./OrderBook";
import { Engine } from "./Engine";

import {
  CREATE_ORDER,
  GET_DEPTH,
  GET_OPEN_ORDER,
  ONRAMP,
  CANCEL_ORDER,
} from "../types/fromApi";


// ============================================================
// Helpers
// ============================================================

function printSection(title: string) {
  console.log("\n");
  console.log("=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

function printResult(title: string, result: unknown) {
  console.log(`\n--- ${title} ---`);
  console.dir(result, { depth: null });
}


// ============================================================
// Create Engine
// ============================================================

const engine = new Engine();


// ============================================================
// Create OrderBook
// ============================================================

// Your Engine currently has orderBooks as a private array,
// so for testing we inject the OrderBook into it.
//
// This is okay for testing. Later you should create a proper
// method such as addOrderBook().

const orderBook = new OrderBook("TATA", "INR", 0);

(engine as any).orderBooks.push(orderBook);


// ============================================================
// TEST 1: ONRAMP BUYER
// ============================================================

printSection("TEST 1: ONRAMP BUYER");

const buyerOnRamp = engine.process({
  type: ONRAMP,
  data: {
    userId: "buyer1",
    amount: 10000,
  },
});

printResult("Buyer OnRamp", buyerOnRamp);


// ============================================================
// TEST 2: ONRAMP SELLER
// ============================================================

printSection("TEST 2: ONRAMP SELLER");

const sellerOnRamp = engine.process({
  type: ONRAMP,
  data: {
    userId: "seller1",
    amount: 5000,
  },
});

printResult("Seller OnRamp", sellerOnRamp);


// ============================================================
// Give Seller TATA
// ============================================================

// OnRamp only creates INR.
//
// For testing we manually give seller TATA.

const balances = (engine as any).userBalance;

const sellerBalance = balances.get("seller1");

sellerBalance.TATA = {
  available: 100,
  lockedOut: 0,
};


printResult(
  "Seller Balance After Giving TATA",
  balances.get("seller1")
);


// ============================================================
// TEST 3: SELL ORDER
// ============================================================
//
// Seller places:
// 10 TATA @ 100 INR
//
// There is no BUY order yet,
// so this should remain in ASK book.
//

printSection("TEST 3: SELL ORDER");

const sellOrderResponse = engine.process({
  type: CREATE_ORDER,
  data: {
    market: "TATA_INR",
    price: "100",
    quantity: "10",
    side: "sell",
    userId: "seller1",
  },
});

printResult("Sell Order Response", sellOrderResponse);


// ============================================================
// TEST 4: GET DEPTH
// ============================================================

printSection("TEST 4: DEPTH AFTER SELL");

const depthAfterSell = engine.process({
  type: GET_DEPTH,
  data: {
    market: "TATA_INR",
  },
});

printResult("Depth After Sell", depthAfterSell);


// ============================================================
// TEST 5: SELLER OPEN ORDERS
// ============================================================

printSection("TEST 5: SELLER OPEN ORDERS");

const sellerOpenOrders = engine.process({
  type: GET_OPEN_ORDER,
  data: {
    market: "TATA_INR",
    userId: "seller1",
  },
});

printResult("Seller Open Orders", sellerOpenOrders);


// ============================================================
// Save Seller Order ID
// ============================================================

const sellOrderId =
  (sellOrderResponse as any).payload.orderId;

console.log("\nSeller Order ID:", sellOrderId);


// ============================================================
// TEST 6: BUY ORDER
// ============================================================
//
// Buyer buys:
// 4 TATA @ 100 INR
//
// Existing SELL:
// 10 TATA @ 100
//
// Expected:
// executedQty = 4
//
// Seller remaining:
// 6 TATA
//
// Buyer order is completely filled,
// so it should NOT remain in bids.
//

printSection("TEST 6: BUY ORDER");

const buyOrderResponse = engine.process({
  type: CREATE_ORDER,
  data: {
    market: "TATA_INR",
    price: "100",
    quantity: "4",
    side: "buy",
    userId: "buyer1",
  },
});

printResult("Buy Order Response", buyOrderResponse);


// ============================================================
// TEST 7: DEPTH AFTER PARTIAL MATCH
// ============================================================

printSection("TEST 7: DEPTH AFTER PARTIAL MATCH");

const depthAfterPartialMatch = engine.process({
  type: GET_DEPTH,
  data: {
    market: "TATA_INR",
  },
});

printResult(
  "Depth After Partial Match",
  depthAfterPartialMatch
);


// ============================================================
// TEST 8: SELLER OPEN ORDERS AFTER PARTIAL MATCH
// ============================================================

printSection("TEST 8: SELLER OPEN ORDERS AFTER PARTIAL MATCH");

const sellerOpenOrdersAfterMatch = engine.process({
  type: GET_OPEN_ORDER,
  data: {
    market: "TATA_INR",
    userId: "seller1",
  },
});

printResult(
  "Seller Open Orders After Match",
  sellerOpenOrdersAfterMatch
);


// ============================================================
// TEST 9: BUYER OPEN ORDERS
// ============================================================

printSection("TEST 9: BUYER OPEN ORDERS");

const buyerOpenOrders = engine.process({
  type: GET_OPEN_ORDER,
  data: {
    market: "TATA_INR",
    userId: "buyer1",
  },
});

printResult("Buyer Open Orders", buyerOpenOrders);


// ============================================================
// TEST 10: BALANCES AFTER PARTIAL MATCH
// ============================================================

printSection("TEST 10: BALANCES AFTER PARTIAL MATCH");

printResult(
  "Buyer Balance",
  balances.get("buyer1")
);

printResult(
  "Seller Balance",
  balances.get("seller1")
);


// ============================================================
// TEST 11: CANCEL REMAINING SELL ORDER
// ============================================================
//
// Seller originally sold 10.
//
// 4 were executed.
//
// Remaining = 6.
//
// Those 6 TATA are still locked.
//
// Cancel the order.
//
// Expected:
//
// Seller TATA:
// available = 96
// lockedOut = 0
//
// Because:
// 90 available after placing order
// + 6 returned from cancellation
// = 96
//
// ============================================================

printSection("TEST 11: CANCEL REMAINING SELL ORDER");

const cancelResponse = engine.process({
  type: CANCEL_ORDER,
  data: {
    market: "TATA_INR",
    orderId: sellOrderId,
  },
});

printResult(
  "Cancel Order Response",
  cancelResponse
);


// ============================================================
// TEST 12: DEPTH AFTER CANCELLATION
// ============================================================

printSection("TEST 12: DEPTH AFTER CANCELLATION");

const depthAfterCancel = engine.process({
  type: GET_DEPTH,
  data: {
    market: "TATA_INR",
  },
});

printResult(
  "Depth After Cancellation",
  depthAfterCancel
);


// ============================================================
// TEST 13: SELLER OPEN ORDERS AFTER CANCELLATION
// ============================================================

printSection(
  "TEST 13: SELLER OPEN ORDERS AFTER CANCELLATION"
);

const sellerOrdersAfterCancel = engine.process({
  type: GET_OPEN_ORDER,
  data: {
    market: "TATA_INR",
    userId: "seller1",
  },
});

printResult(
  "Seller Open Orders After Cancellation",
  sellerOrdersAfterCancel
);


// ============================================================
// TEST 14: FINAL BALANCES
// ============================================================

printSection("TEST 14: FINAL BALANCES");

printResult(
  "Buyer Final Balance",
  balances.get("buyer1")
);

printResult(
  "Seller Final Balance",
  balances.get("seller1")
);

