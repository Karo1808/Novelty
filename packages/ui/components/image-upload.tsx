import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import * as React from "react";

export type ImageUploadProps = {
  /** File from RHF or an existing URL */
  value: File | string | null;
  onChange: (file: File | null) => void;

  accept?: string;
  maxSize?: number;

  label?: string;
  className?: string;
  avatarClassName?: string;
  disabled?: boolean;

  /** Fallback inside Avatar when no image (e.g., initials) */
  fallback?: React.ReactNode;

  /** Optional error plumbed in from your form */
  error?: string | null;
  onError?: (msg: string) => void;
  fallbackUrl: string;
};

export const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      value,
      onChange,
      accept = "image/png,image/jpeg,image/webp",
      maxSize = 2 * 1024 * 1024,
      label = "Upload photo",
      className,
      avatarClassName = "h-20 w-20",
      disabled,
      fallback,
      fallbackUrl,
      error,
      onError,
    },
    _ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const file = value instanceof File ? value : null;
    const existingUrl = typeof value === "string" ? value : null;

    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
    const previewUrl = existingUrl ?? objectUrl ?? fallbackUrl;

    React.useEffect(() => {
      if (!file) {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          setObjectUrl(null);
        }
        return;
      }
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [file]);

    const trigger = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      if (!f) {
        onChange(null);
        return;
      }
      if (maxSize && f.size > maxSize) {
        const msg = `File is too large (max ${Math.round(maxSize / 1024 / 1024)}MB).`;
        onError?.(msg);
        e.target.value = "";
        return;
      }
      if (
        accept &&
        !accept
          .split(",")
          .map((s) => s.trim())
          .some((t) => f.type === t)
      ) {
        const msg = "Invalid file type.";
        onError?.(msg);
        e.target.value = "";
        return;
      }
      onChange(f);
    };

    const remove = () => {
      onChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className={cn("flex items-start gap-4", className)}>
        {/* Preview with shadcn Avatar */}
        <Avatar>
          {previewUrl ? (
            <AvatarImage
              width={40}
              height={40}
              src={previewUrl}
              alt="Selected profile"
            />
          ) : (
            <AvatarFallback className="text-sm text-muted-foreground">
              {fallback ?? <ImageIcon className="h-5 w-5" />}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={disabled}
            onChange={handleChange}
          />

          <Button type="button" onClick={trigger} disabled={disabled}>
            {file || existingUrl ? "Change photo" : label}
          </Button>

          {(file || existingUrl) && (
            <Button
              type="button"
              variant="outline"
              onClick={remove}
              disabled={disabled}
            >
              Remove
            </Button>
          )}

          {error && (
            <p className="w-full mt-1 text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";
