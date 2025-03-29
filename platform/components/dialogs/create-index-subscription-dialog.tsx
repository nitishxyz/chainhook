"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { IconTable, IconPlus, IconX } from "@tabler/icons-react";
import { useConnections } from "@/services/api/connections";
import { useIndexTypes } from "@/services/api/index-types";
import { useCreateIndexSubscription } from "@/services/api/index-subscriptions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  connectionId: z.string().min(1, "Database connection is required"),
  indexTypeId: z.string().min(1, "Index type is required"),
  targetTable: z.string().min(1, "Target table is required"),
  addresses: z.array(z.string()).min(1, "At least one address is required"),
  description: z.string().optional(),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export type IndexType = {
  id: string;
  name: string;
  description: string;
};

export function CreateIndexSubscriptionDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<IndexType | null>(
    null
  );
  const [newAddress, setNewAddress] = React.useState("");
  const { data: connectionsData, isLoading: isLoadingConnections } =
    useConnections();
  const {
    data: indexTypesData,
    isLoading: isLoadingIndexTypes,
    error: indexTypesError,
  } = useIndexTypes();
  const { mutate: createSubscription, isPending: isCreating } =
    useCreateIndexSubscription();

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      connectionId: "",
      indexTypeId: "",
      targetTable: "",
      addresses: [],
      description: "",
    },
  });

  const addresses = form.watch("addresses");

  const addAddress = () => {
    if (newAddress && !addresses.includes(newAddress)) {
      form.setValue("addresses", [...addresses, newAddress]);
      setNewAddress("");
    }
  };

  const removeAddress = (address: string) => {
    form.setValue(
      "addresses",
      addresses.filter((a) => a !== address)
    );
  };

  const onSubmit = async (formData: SubscriptionFormValues) => {
    createSubscription(formData, {
      onSuccess: () => {
        toast.success("Index subscription created successfully");
        setOpen(false);
        form.reset();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create index subscription");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconTable className="mr-2 h-4 w-4" />
          Create Index
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="mb-6">
          <DialogTitle>Create Index Subscription</DialogTitle>
          <DialogDescription>
            Create a new index subscription to start indexing your database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Subscription Name</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="My Index Subscription"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      A friendly name to identify this subscription
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="connectionId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Database Connection</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select a database connection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {connectionsData?.connections.map((connection) => (
                          <SelectItem key={connection.id} value={connection.id}>
                            {connection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="indexTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Index Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(
                        indexTypesData?.indexTypes.find(
                          (t) => t.id === value
                        ) || null
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select an index type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingIndexTypes ? (
                        <SelectItem value="loading" disabled>
                          Loading index types...
                        </SelectItem>
                      ) : indexTypesError ? (
                        <SelectItem value="error" disabled>
                          Error loading index types
                        </SelectItem>
                      ) : !indexTypesData ? (
                        <SelectItem value="no-data" disabled>
                          No index types available
                        </SelectItem>
                      ) : (
                        indexTypesData.indexTypes.map((type: IndexType) => (
                          <SelectItem
                            key={type.id}
                            value={type.id}
                            className="break-normal"
                          >
                            {type.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {selectedType
                      ? selectedType.description
                      : "Select the type of data you want to index"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetTable"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Target Table</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="my_index_table"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      The name of the table where indexed data will be stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Optional description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addresses"
              render={() => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Addresses to Index</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormControl>
                        <input
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter an address"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAddress();
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-3"
                        onClick={addAddress}
                      >
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {addresses.length > 0 && (
                      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 border rounded-md bg-muted/50">
                        {addresses.map((address) => (
                          <div
                            key={address}
                            className="flex items-center gap-1 rounded-md bg-background border px-2 py-1"
                          >
                            <span className="text-sm truncate max-w-[200px]">
                              {address}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent"
                              onClick={() => removeAddress(address)}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormDescription className="text-xs">
                    Add one or more addresses to index
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {indexTypesError && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load index types. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isCreating || isLoadingIndexTypes || isLoadingConnections
                }
              >
                {isCreating ? "Creating..." : "Create Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
