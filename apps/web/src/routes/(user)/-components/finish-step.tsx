import { UpdateOnboarding } from "@/lib/schemas";
import { DEFAULT_AVATAR_URL } from "@novelty/lib/config";
import { useAvatarSrc } from "@novelty/lib/hooks/use-avatar-src";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@novelty/ui/components/avatar";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormState } from "react-hook-form";
import Section from "./section";
import Tags from "./tags";

interface FinishStepProps {
  formValues: UpdateOnboarding;
  formState: FormState<UpdateOnboarding>;
}

const FinishStep = ({ formValues, formState }: FinishStepProps) => {
  const v = formValues;
  const { errors } = formState;
  const username = v?.username?.trim() || "";
  const bio = v?.bio?.trim() || "";

  const previewSrc =
    useAvatarSrc(v?.profileImage as unknown) || DEFAULT_AVATAR_URL;

  const [imgSrc, setImgSrc] = useState(previewSrc);
  useEffect(() => setImgSrc(previewSrc), [previewSrc]);

  const genres = v?.genres ?? [];
  const authors = v?.authors ?? [];
  const series = v?.series ?? [];

  return (
    <div className="grid gap-6">
      {/* Header / identity */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <Avatar className="size-15">
          {imgSrc ? (
            <AvatarImage
              width={80}
              height={80}
              src={imgSrc}
              alt="Selected profile"
            />
          ) : (
            <AvatarFallback className="text-sm text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
        {errors.profileImage && (
          <p className="text-xs text-red-400">{errors.profileImage.message}</p>
        )}

        <div className="flex-1">
          <div className="text-xl font-semibold text-slate-100">{username}</div>
          {errors.username && (
            <p className="text-xs text-red-400">{errors.username.message}</p>
          )}
          {bio ? (
            <p className="text-sm text-slate-300 mt-1">{bio}</p>
          ) : (
            <p className="text-sm text-slate-500 mt-1">No bio provided.</p>
          )}
          {errors.bio && (
            <p className="text-xs text-red-400">{errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Favorite genres">
          <Tags items={genres} empty="No genres selected" />
          {errors.genres && (
            <p className="text-xs text-red-400 mt-1">{errors.genres.message}</p>
          )}
        </Section>
        <Section title="Favorite authors">
          <Tags items={authors} empty="No authors selected" />
          {errors.authors && (
            <p className="text-xs text-red-400 mt-1">
              {errors.authors.message}
            </p>
          )}
        </Section>
        <Section title="Favorite series">
          <Tags items={series} empty="No series selected" />
          {errors.series && (
            <p className="text-xs text-red-400 mt-1">{errors.series.message}</p>
          )}
        </Section>
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm text-slate-300">
        Looks good? Hit{" "}
        <span className="font-medium text-slate-100">Finish</span> to save. You
        can change these anytime in Settings.
      </div>
    </div>
  );
};

export default FinishStep;
