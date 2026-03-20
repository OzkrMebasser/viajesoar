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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Step
      number={number}
      label={t(locale, "Pasajeros", "Passengers")}
      completed={form.adults >= 1}  locale={locale} 
    >
      <div className="grid grid-cols-2 gap-3">
        <Field icon={<FaUser />} label={t(locale, "Adultos", "Adults")} required>
          <PassengerCounter
            label={t(locale, "Adultos", "Adults")}
            name="adults"
            value={form.adults}
            min={1}
            onChange={onChange}
          />
        </Field>
        <Field icon={<FaUser />} label={t(locale, "Menores", "Children")}>
          <PassengerCounter
            label={t(locale, "Menores", "Children")}
            name="children"
            value={form.children}
            min={0}
            onChange={onChange}
            optional
          />
        </Field>
      </div>
    </Step>
  );
}