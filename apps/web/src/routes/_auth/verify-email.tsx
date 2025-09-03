import {
  getPendingEmail,
  sendVerificationEmailFn,
  verifyEmailFn,
} from "@/server/auth.functions";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  VerifyEmailBodySchema,
  verifyEmailBodySchema,
} from "@novelty/lib/validations/auth";
import { Button } from "@novelty/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@novelty/ui/components/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@novelty/ui/components/input-otp";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/verify-email")({
  component: RouteComponent,
  loader: async () => {
    const data = await getPendingEmail();
    return data;
  },
});

function RouteComponent() {
  const recipientEmail = Route.useLoaderData();
  const navigate = useNavigate({ from: "/verify-email" });

  const sendVerificationEmail = useServerFn(sendVerificationEmailFn);
  const verifyEmail = useServerFn(verifyEmailFn);

  const [isResendPending, setIsResendPending] = useState<boolean>(false);
  const [isVerificationPending, setIsVerificationPending] =
    useState<boolean>(false);

  const form = useForm<Omit<VerifyEmailBodySchema, "email">>({
    resolver: standardSchemaResolver(
      verifyEmailBodySchema.omit({
        email: true,
      }),
    ),
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (data: Omit<VerifyEmailBodySchema, "email">) => {
    if (isVerificationPending) {
      return;
    }

    setIsVerificationPending(true);
    try {
      const response = await verifyEmail({
        data: {
          email: recipientEmail,
          verificationCode: data.verificationCode,
        },
      });

      if (!response.success) {
        form.setError("verificationCode", { message: response.message });
        return;
      }

      // TODO: Update with onboarding
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Something went wrong, please try again");
    } finally {
      setIsVerificationPending(false);
    }
  };

  const handleResendClick = async () => {
    setIsResendPending(true);
    try {
      const response = await sendVerificationEmail({ data: recipientEmail });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Email has been sent");
    } catch (error) {
      toast.error("Failed to send email, try again");
    } finally {
      setIsResendPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-8 gap-5">
      <div className="max-w-md w-full space-y-6 p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-lg shadow-slate-900/50 text-center">
        <h1 className="text-2xl font-bold text-slate-100">Verify Your Email</h1>
        <p className="text-md text-slate-300">
          We've sent a verification code to{" "}
          <span className="text-indigo-400">{recipientEmail}</span>
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col w-full"
          >
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem className="justify-center w-full">
                  <FormControl>
                    <InputOTP
                      pattern={REGEXP_ONLY_DIGITS}
                      maxLength={6}
                      className="[&>div]:justify-center [&_input]:text-slate-500 [&_input]:bg-slate-700 [&_input]:border-slate-600 [&_input:hover]:border-slate-500"
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
                        shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                        active:scale-95 active:bg-indigo-700 rounded-sm text-slate-200 font-medium"
              disabled={isVerificationPending}
            >
              Verify Email
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              className="text-indigo-400 hover:text-indigo-300  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm transition-colors duration-200 cursor-pointer"
              aria-label="Resend verification email"
              onClick={handleResendClick}
              disabled={isResendPending}
            >
              Didn't receive the email? Resend
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
