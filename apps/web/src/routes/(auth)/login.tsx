import { loginFn } from "@/server/auth.functions";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { InsertUser, insertUserSchema } from "@novelty/db/schemas/user.schema";
import { userQuery } from "@novelty/react-query/modules/user/user.query";
import { Button } from "@novelty/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@novelty/ui/components/form";
import { Input } from "@novelty/ui/components/input";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/login" });
  const login = useServerFn(loginFn);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { queryClient } = Route.useRouteContext();

  const form = useForm<InsertUser["login"]>({
    resolver: standardSchemaResolver(insertUserSchema.shape.login),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: InsertUser["login"]) => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const response = await login({ data: values });

      if (!response.success) {
        form.reset();
        form.setError("email", { message: response.message });
        form.setError("password", { message: response.message });
        return;
      }

      queryClient.setQueryData(userQuery.userKey, response);

      form.reset();
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Login failed, try again");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-lg shadow-slate-900/50">
        <h1 className="text-2xl font-bold text-slate-100">
          Log in to your account
        </h1>

        <Providers />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">or</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 text-slate-300"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      className="bg-slate-800 border-slate-700 text-slate-100 px-4 py-2 rounded-md
                                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                                hover:border-slate-600 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-slate-800 border-slate-700 text-slate-100 px-4 py-2 rounded-md
                                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                                hover:border-slate-600 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
                      shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                      active:scale-95 active:bg-indigo-700 rounded-sm text-slate-200"
            >
              Log in
            </Button>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
