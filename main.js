import { load } from "./loader.js";
import { wsIdentifier } from "./wsidentifier.js";

console.log("main.js loaded");

load(wsIdentifier, "ctlBody");
