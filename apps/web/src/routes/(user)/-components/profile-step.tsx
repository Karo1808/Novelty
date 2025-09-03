import { UpdateOnboarding } from "@/lib/schemas";
import { DEFAULT_AVATAR_URL } from "@novelty/lib/config";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@novelty/ui/components/form";
import { ImageUpload } from "@novelty/ui/components/image-upload";
import { Input } from "@novelty/ui/components/input";
import { Textarea } from "@novelty/ui/components/textarea";
import { UseFormReturn } from "react-hook-form";

interface ProfileStepProps {
  form: UseFormReturn<UpdateOnboarding>;
  avatarUrl?: string;
}

const ProfileStep = ({ form, avatarUrl }: ProfileStepProps) => {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-lg font-semibold">Tell us about you</h3>
        <p className="text-sm text-muted-foreground">
          This helps us tailor defaults.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1 ">
              <FormLabel className="text-slate-200">Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="bg-slate-800 border-slate-700 text-slate-100 px-4 py-2 rounded-md
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  hover:border-slate-600 transition-colors"
                  placeholder="username"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem className="space-y-1 row-start-2 md:row-start-1 col-span-2 md:col-2">
              <FormLabel>Profile photo</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? []}
                  onChange={(file) => field.onChange(file)}
                  fallbackUrl={avatarUrl ?? DEFAULT_AVATAR_URL}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-1 col-span-2">
              <FormLabel className="text-slate-200">Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={6}
                  className="bg-slate-800 border-slate-700 text-slate-100 px-4 py-2 rounded-md
                                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                                hover:border-slate-600 transition-colors"
                  placeholder="Tell us about yourself"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProfileStep;
