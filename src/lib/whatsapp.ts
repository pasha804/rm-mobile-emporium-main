import { SHOP } from "./shop";

export function buildOrderMessage(opts: {
  productName: string;
  price: number;
  quantity: number;
}) {
  const total = opts.price * opts.quantity;
  return [
    "Assalam-o-Alaikum,",
    "",
    `I would like to place an order from ${SHOP.name}.`,
    "",
    `Product: ${opts.productName}`,
    `Price: ${SHOP.currency} ${opts.price.toLocaleString()}`,
    `Quantity: ${opts.quantity}`,
    `Total Price: ${SHOP.currency} ${total.toLocaleString()}`,
    "",
    "Please confirm product availability.",
    "Kindly contact me regarding delivery address, payment method, delivery charges and expected delivery time.",
    "",
    "Thank you.",
  ].join("\n");
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function orderUrl(opts: { productName: string; price: number; quantity: number }) {
  return whatsappUrl(buildOrderMessage(opts));
}

export function inquiryUrl(text = `Hi ${"RM MOBILE SHOP"}, I have a question.`) {
  return whatsappUrl(text);
}