import { fastOrder } from "./fastOrder.js";

export function load(onChangeFunction, element) {
  const config = { attributes: true, childList: true, subtree: true };
  const mutationObserver = new MutationObserver(onChangeFunction);
  if (typeof element === "string") {
    element = document.getElementById(element);
  }

  if (!element) {
    return;
  }
  if (element.localName !== "iframe") {
    mutationObserver.observe(element, config);
    return;
  }
  let nameOfApp;

  if (element.attributes) {
    nameOfApp = element.attributes.getNamedItem("wfcmdname");
  }

  if (!nameOfApp) {
    return;
  }
  if (nameOfApp.value === "Sales_FastOrders") {
    fastOrder(element);
  }
}
