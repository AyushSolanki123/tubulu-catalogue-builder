import { Dialog } from "quasar";

export function dialog(input) {
  return Dialog.create({
    title: input.title,
    message: input.message,
    cancel: true,
    class: "text-subtitle1 text-weight-medium",
    style: "border-radius: 16px",
    ok: {
      color: "negative",
    },
    cancel: {
      color: "primary",
    },
  });
}
