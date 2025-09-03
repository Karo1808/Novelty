import { ONBOARDING_STEPS } from "@/lib/config";
import { UpdateOnboarding, updateOnboardingSchema } from "@/lib/schemas";
import { getUserDraftFn, updateUserDraftFn } from "@/server/draft.functions";
import { getUserFn, onboardFn } from "@/server/user.functions";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useDraft } from "@novelty/lib/hooks/use-draft";
import { draftQuery } from "@novelty/react-query/modules/draft/draft.query";
import { userQuery } from "@novelty/react-query/modules/user/user.query";
import { Form } from "@novelty/ui/components/form";
import OnboardingShell from "@novelty/ui/components/onboarding";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FinishStep from "./-components/finish-step";
import PreferencesStep from "./-components/preferences-step";
import ProfileStep from "./-components/profile-step";
import WelcomeStep from "./-components/welcome-step";

export const Route = createFileRoute("/(user)/onboarding")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getUserFn();
    if (user.success && user.user.isOnboarded) {
      // TODO: Update to user profile
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData({
      queryKey: userQuery.userKey,
      queryFn: getUserFn,
    });

    context.queryClient.ensureQueryData({
      ...draftQuery.draftUserOpts(),
      queryFn: getUserDraftFn,
    });
  },
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery({
    queryKey: userQuery.userKey,
    queryFn: getUserFn,
    select: (data) => (data.success ? data.user : null),
  });

  const { data: userDraft } = useSuspenseQuery({
    queryKey: draftQuery.draftUserOpts().queryKey,
    queryFn: getUserDraftFn,
    staleTime: 0,
    refetchInterval: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const onboard = useServerFn(onboardFn);
  const updateUserDraft = useServerFn(updateUserDraftFn);

  const navigate = useNavigate({
    from: "/onboarding",
  });

  const defaultValues: UpdateOnboarding = {
    username:
      userDraft?.data?.profile?.username ?? user?.userInfo.profile.username,
    bio: userDraft?.data?.profile?.bio ?? user?.userInfo.profile.bio,
    profileImage:
      userDraft?.data?.profile?.avatarUrl ?? user?.userInfo.profile.avatarUrl,
    genres:
      userDraft?.data?.preferences?.genres ??
      user?.userInfo.preferences.genres ??
      [],
    authors:
      userDraft?.data?.preferences?.authors ??
      user?.userInfo.preferences.authors,
    series:
      userDraft?.data?.preferences?.series ?? user?.userInfo.preferences.series,
  };

  const form = useForm<UpdateOnboarding>({
    resolver: standardSchemaResolver(updateOnboardingSchema),
    defaultValues,
  });

  useDraft<UpdateOnboarding>(
    form.control,
    (values) =>
      updateUserDraft({ data: { ...values, profileImage: undefined } }),
    {
      debounceMs: 1000,
    },
  );

  const onSubmit = async (values: UpdateOnboarding) => {
    const formData = new FormData();

    formData.set("username", values.username ?? "");
    formData.set("profileImage", values.profileImage);
    formData.set("bio", values.bio ?? "");

    values.genres.forEach((g) => formData.append("genres[]", g));
    values.authors?.forEach((a) => formData.append("authors[]", a));
    values.series?.forEach((s) => formData.append("series[]", s));

    const response = await onboard({ data: formData });

    if ("stage" in response && response.stage === "update") {
      return;
    }

    if ("stage" in response && response.stage === "onboarding") {
      toast.error("Something went wrong please try again");
    }

    throw redirect({ to: "/" });
  };

  if (!user?.id) {
    navigate({ to: "/login" });
  }

  if (user?.isOnboarded) {
    navigate({ to: `/user/profile/$userId`, params: { userId: user.id } });
  }

  {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-h-screen bg-slate-900 text-slate-100 w-full flex sm:items-center sm:justify-center pt-10 pb-10 sm:pt-0"
        >
          <OnboardingShell
            steps={ONBOARDING_STEPS}
            containerClassName="w-full md:w-[90%] lg:w-[75%] 2xl:w-[50%] h-[95vh] sm:h-fit"
            allowJumpAhead
            renderStep={(index, step) => {
              switch (step.id) {
                case "welcome":
                  return <WelcomeStep />;

                case "profile":
                  return (
                    <ProfileStep
                      form={form}
                      avatarUrl={user?.userInfo.profile.avatarUrl ?? ""}
                    />
                  );

                case "prefs":
                  return <PreferencesStep form={form} />;

                case "finish":
                  return (
                    <FinishStep
                      formState={form.formState}
                      formValues={form.getValues()}
                    />
                  );
              }
            }}
          />
        </form>
      </Form>
    );
  }
}
