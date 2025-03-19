import { defineNuxtPlugin } from "#app";
import { Buffer } from "buffer";
import Long from "long";

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.Buffer = Buffer;
    window.Long = Long;
  }
});
