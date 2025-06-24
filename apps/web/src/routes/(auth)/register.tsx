import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  insertUserSchema,
  type InsertUser,
} from "@novelty/db/schemas/user.schema";
import { Button } from "@novelty/ui/components/button";
import { Checkbox } from "@novelty/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@novelty/ui/components/form";
import { Input } from "@novelty/ui/components/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(auth)/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<InsertUser["registerFormEmail"]>({
    resolver: standardSchemaResolver(insertUserSchema.shape.registerFormEmail),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      promotional: false,
    },
  });

  const onSubmit = (values: InsertUser["registerFormEmail"]) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-lg shadow-slate-900/50">
        <h1 className="text-2xl font-bold text-slate-100">Create an account</h1>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-200">
                    Confirm Password
                  </FormLabel>
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
            <FormField
              control={form.control}
              name="terms"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={`h-5 w-5 rounded text-indigo-500
                                  focus:ring-indigo-500 focus:ring-offset-slate-800
                                  ${fieldState.error ? "border-red-500 bg-red-900/20" : "border-slate-600 bg-slate-700"}`}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-200">
                      I accept the{" "}
                      <Link
                        to="/terms-of-service"
                        className="text-indigo-400 hover:underline"
                      >
                        Terms of Service
                      </Link>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotional"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={`h-5 w-5 rounded text-indigo-500
                                  focus:ring-indigo-500 focus:ring-offset-slate-800
                                  ${fieldState.error ? "border-red-500 bg-red-900/20" : "border-slate-600 bg-slate-700"}`}
                      />
                    </FormControl>
                    <FormLabel className="text-slate-200">
                      Send me promotional emails{" "}
                      <span className="text-slate-400">(Optional)</span>
                    </FormLabel>
                  </div>
                  <FormMessage className="text-red-400 text-sm mt-1 px-1 py-1 bg-red-900/30 rounded" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
                      shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                      active:scale-95 active:bg-indigo-700 rounded-sm"
            >
              Sign up
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Log in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
