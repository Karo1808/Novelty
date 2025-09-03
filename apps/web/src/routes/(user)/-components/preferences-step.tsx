import { UpdateOnboarding } from "@/lib/schemas";
import {
  BOOK_AUTHORS,
  BOOK_GENRES_STATIC,
  BOOK_SERIES,
} from "@novelty/lib/config";
import { fuzzyMatch } from "@novelty/lib/misc";
import { AutocompleteMulti } from "@novelty/ui/components/autocomplete";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@novelty/ui/components/form";
import { UseFormReturn } from "react-hook-form";

interface PreferencesStepProps {
  form: UseFormReturn<UpdateOnboarding>;
}

const PreferencesStep = ({ form }: PreferencesStepProps) => {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-lg font-semibold">What books do you like?</h3>
        <p className="text-sm text-muted-foreground">
          This helps us recommend adequate novels
        </p>
      </div>
      <FormField
        control={form.control}
        name="genres"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Genres</FormLabel>
            <FormControl>
              <AutocompleteMulti
                options={BOOK_GENRES_STATIC}
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Search genres…"
                maxResults={10}
                fuzzyMatchFn={fuzzyMatch}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authors</FormLabel>
            <FormControl>
              <AutocompleteMulti
                options={BOOK_AUTHORS}
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Search authors…"
                maxResults={10}
                fuzzyMatchFn={fuzzyMatch}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="series"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Series</FormLabel>
            <FormControl>
              <AutocompleteMulti
                options={BOOK_SERIES}
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Search series…"
                maxResults={10}
                fuzzyMatchFn={fuzzyMatch}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PreferencesStep;
