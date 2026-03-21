import { FaUser } from "react-icons/fa";
import { Field } from "./ui/Field";
import { type Locale, type QuoteFormState, t } from "@/types/quote";
import { Step } from "./ui/Step";
import { PassengerCounter } from "./ui/PassengerCounter";

export function PassengersStep({
  locale,
  number,
  form,
  onChange,
}: {
  locale: Locale;
  number: number;
  form: QuoteFormState;
  onChange: (field: "adults" | "children", value: number) => void;
}) {
  return (
    <Step
      number={number}
      label={t(locale, "Pasajeros", "Passengers")}
      completed={form.adults >= 1}
      locale={locale}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field icon={<FaUser />} label={t(locale, "Adultos", "Adults")} required>
          <PassengerCounter
            label={t(locale, "Adultos", "Adults")}
            value={form.adults}
            min={1}
            onChange={(val) => onChange("adults", val)}
          />
        </Field>
        <Field icon={<FaUser />} label={t(locale, "Menores", "Children")}>
          <PassengerCounter
            label={t(locale, "Menores", "Children")}
            value={form.children}
            min={0}
            onChange={(val) => onChange("children", val)}
            optional
          />
        </Field>
      </div>
    </Step>
  );
}