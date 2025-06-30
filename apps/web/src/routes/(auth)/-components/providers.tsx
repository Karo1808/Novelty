import { oAuthFn } from "@/server/auth.functions";
import amazon from "@iconify-icons/simple-icons/amazon";
import google from "@iconify-icons/simple-icons/google";
import { Icon } from "@iconify/react";
import { InsertAuthProvider } from "@novelty/db/schemas/auth-provider.schema";
import { Button } from "@novelty/ui/components/button";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Providers = () => {
  const [isOAuthPending, setIsOAuthPending] = useState<boolean>(false);
  const oAuth = useServerFn(oAuthFn);

  const handleOAuth = async (
    provider: InsertAuthProvider["init"]["provider"],
  ) => {
    setIsOAuthPending(true);

    try {
      // @ts-ignore
      const { url, success } = await oAuth({
        data: { provider }, // matches .validator schema
      });

      if (!success) {
        toast.error("Something went wrong");
        return;
      }

      // TODO: Update to include popup window
      window.location.assign(url);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsOAuthPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        disabled={isOAuthPending}
        onClick={() => {
          handleOAuth("google");
        }}
        type="button"
        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all duration-200
                      shadow-md shadow-slate-900/10 hover:shadow-slate-900/20
                      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500
                      active:scale-95 active:bg-slate-500 rounded-sm flex items-center justify-center gap-2
                      border border-slate-700"
      >
        <Icon icon={google} />
        Continue with Google
      </Button>
      <Button
        onClick={() => {
          handleOAuth("amazon");
        }}
        type="button"
        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all duration-200
                      shadow-md shadow-slate-900/10 hover:shadow-slate-900/20
                      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500
                      active:scale-95 active:bg-slate-500 rounded-sm flex items-center justify-center gap-2
                      border border-slate-700"
      >
        <Icon icon={amazon} />
        Continue with Amazon
      </Button>
    </div>
  );
};
