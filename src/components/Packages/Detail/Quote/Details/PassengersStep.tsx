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
    <Step number={number} label={t(locale, "Pasajeros", "Passengers")}>
      <div className="grid grid-cols-2 gap-3">
        <PassengerCounter
          label={t(locale, "Adultos", "Adults")}
          name="adults" value={form.adults} min={1}
          onChange={onChange}
        />
        <PassengerCounter
          label={t(locale, "Menores", "Children")}
          name="children" value={form.children} min={0}
          onChange={onChange}
        />
      </div>
    </Step>
  );
}