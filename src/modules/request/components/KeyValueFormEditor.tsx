"use client";

import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef } from "react";

const keyValueSchema = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
      enabled: z.boolean().default(true).optional(),
    })
  ),
});
type KeyValueFormData = z.infer<typeof keyValueSchema>;

export interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean;
}

interface KeyValueFormEditorProps {
  initialData?: KeyValueItem[];
  onSubmit: (data: KeyValueItem[]) => void;
  placeholder?: {
    key?: string;
    value?: string;
    description?: string;
  };
  className?: string;
}

const KeyValueFormEditor: React.FC<KeyValueFormEditorProps> = ({
  onSubmit,
  initialData = [],
  placeholder = {
    key: "Key",
    value: "Value",
    description: "Description",
  },
  className,
}) => {
  const form = useForm<KeyValueFormData>({
    resolver: zodResolver(keyValueSchema),
    defaultValues: {
      items:
        initialData.length > 0
          ? initialData.map((item) => ({
              ...item,
              enabled: item.enabled ?? true,
            }))
          : [{ key: "", value: "", enabled: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function addNewRow() {
    append({ key: "", value: "", enabled: true });
  }
  function toggleEnabled(index: number) {
    const currentValue = form.getValues(`items.${index}.enabled`);
    form.setValue(`items.${index}.enabled`, !currentValue);
  }
  function removeRow(index: number) {
    if (fields.length > 1) {
      remove(index);
    }
  }

  //Auto save
  const lastSavedRef = useRef<string | null>(null);
  function getFilteredItemsFormValues(items: KeyValueItem[]) {
    return items
      .filter((item) => item.enabled && (item.key?.trim() || item.value?.trim()))
      .map(({ key, value }) => ({ key, value }));
  }
  function debounce(fn: (...args: any[]) => void, wait = 500) {
    let t: ReturnType<typeof setTimeout> | null = null;

    return (...args: any[]) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const saveIfChanged = useCallback(
    (items: KeyValueItem[]) => {
      const filtered = getFilteredItemsFormValues(items);

      const serialized = JSON.stringify(filtered);
      if (serialized !== lastSavedRef.current) {
        lastSavedRef.current = serialized;
        onSubmit(filtered);
      }
    },
    [onSubmit]
  );
  const debouncedSaveRef = useRef(saveIfChanged);

  useEffect(() => {
    debouncedSaveRef.current = saveIfChanged;
  }, [saveIfChanged]);
  const debouncedInvokeRef = useRef<((items: KeyValueItem[]) => void) | null>(null);

  useEffect(() => {
    debouncedInvokeRef.current = debounce((items: KeyValueItem[]) => {
      debouncedSaveRef.current(items);
    }, 500);
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const items = (value as KeyValueFormData)?.items || [];
      debouncedInvokeRef.current?.(items as KeyValueItem[]);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className={cn("w-full", className)}>
      <FormProvider {...form}>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium dark:text-zinc-400 text-zinc-200">
              Query parameters
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addNewRow}
                className="size-8 p-0 hover:dark:bg-zinc-700  text-zinc-200">
                <Plus className="size-4 hover:dark:text-zinc-300" />
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                "grid grid-cols-12 gap-3 p-3 rounded-lg border transition-all",
                form.watch(`items.${index}.enabled`)
                  ? "dark:bg-zinc-900 dark:border-zinc-700 bg-transparent border-zinc-200"
                  : "dark:bg-zinc-800/50 dark:border-zinc-800 bg-zinc-300 border-zinc-300 opacity-60"
              )}>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={placeholder.key}
                          className=" bg-zinc-400 border-0 focus:ring-0 text-sm placeholder:dark:text-zinc-300"
                          disabled={!form.watch(`items.${index}.enabled`)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={placeholder.value}
                          className=" bg-zinc-400 border-0 focus:ring-0 text-sm placeholder:dark:text-zinc-100"
                          disabled={!form.watch(`items.${index}.enabled`)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <FormField
                  control={form.control}
                  name={`items.${index}.enabled`}
                  render={({ field: checkboxField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEnabled(index)}
                            className={cn(
                              "size-5 p-0 rounded-sm border-2 transition-colors cursor-pointer",
                              checkboxField.value
                                ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                                : "border-red-500 text-red-500 hover:bg-red-400"
                            )}>
                            {checkboxField.value ? (
                              <Check className="size-3" />
                            ) : (
                              <X className="size-3" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className={cn(
                    "size-5 p-0 transition-colors cursor-pointer",
                    fields.length <= 1
                      ? "dar:text-zinc-400 text-zinc-200 cursor-not-allowed"
                      : "text-red-400 hover:text-red-300 hover:bg-gray-900/20"
                  )}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </section>
        <section className="flex justify-end pt-4">
          <span className="text-xs text-zinc-500">Changes saved automatically</span>
        </section>
      </FormProvider>
    </div>
  );
};

export default KeyValueFormEditor;
