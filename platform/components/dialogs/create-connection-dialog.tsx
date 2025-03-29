"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IconDatabase } from "@tabler/icons-react";
import {
  useTestConnection,
  useCreateConnection,
} from "@/services/api/connections";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

const connectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port must be a positive number"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  database: z.string().min(1, "Database name is required"),
  sslMode: z
    .enum(["disable", "require", "verify-ca", "verify-full"])
    .default("require"),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

type FormFieldProps = {
  field: ControllerRenderProps<
    ConnectionFormValues,
    keyof ConnectionFormValues
  >;
};

export function CreateConnectionDialog({
  buttonClassName,
}: {
  buttonClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { mutate: testConnection, isPending: isTesting } = useTestConnection();
  const { mutate: createConnection, isPending: isCreating } =
    useCreateConnection();
  const [testResult, setTestResult] = React.useState<{
    success: boolean;
    message: string;
    data?: {
      version: string;
      schemas: string[];
      tables?: { schema: string; name: string }[];
      extensions?: { name: string; version: string }[];
    };
  } | null>(null);

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: "",
      host: "",
      port: 5432,
      username: "",
      password: "",
      database: "",
      sslMode: "require",
    },
  });

  const onSubmit = async (formData: ConnectionFormValues) => {
    createConnection(formData, {
      onSuccess: () => {
        toast.success("Database connection created successfully");
        setOpen(false);
        form.reset();
        setTestResult(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create database connection");
      },
    });
  };

  const onTestConnection = async (formData: ConnectionFormValues) => {
    try {
      setTestResult(null);
      await testConnection(formData, {
        onSuccess: (data) => {
          setTestResult({
            success: true,
            message: data.message,
            data: data.data,
          });
          toast.success("Connection test successful");
        },
        onError: (error) => {
          setTestResult({
            success: false,
            message: error.message,
          });
          toast.error(error.message || "Connection test failed");
        },
      });
    } catch (err) {
      console.error("Connection test failed:", err);
      toast.error("Connection test failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          <IconDatabase className="mr-2 h-4 w-4" />
          New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Database Connection</DialogTitle>
          <DialogDescription>
            Add a new database connection to your project. Fill in the details
            below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Connection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Database" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this connection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="host"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="postgres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="database"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="mydb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sslMode"
              render={({ field }: FormFieldProps) => (
                <FormItem>
                  <FormLabel>SSL Mode</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      {...field}
                    >
                      <option value="disable">Disable</option>
                      <option value="require">Require</option>
                      <option value="verify-ca">Verify CA</option>
                      <option value="verify-full">Verify Full</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {testResult && (
              <Alert
                variant={testResult.success ? "default" : "destructive"}
                className="py-2"
              >
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {testResult.success ? (
                    <div className="space-y-0.5 text-xs">
                      <p className="text-sm font-medium">
                        {testResult.message}
                      </p>
                      {testResult.data && (
                        <>
                          <p>PostgreSQL {testResult.data.version}</p>
                          <p>Schemas: {testResult.data.schemas.join(", ")}</p>
                          {testResult.data.tables &&
                            testResult.data.tables.length > 0 && (
                              <p>
                                Tables:{" "}
                                {testResult.data.tables
                                  .map((t) => `${t.schema}.${t.name}`)
                                  .join(", ")}
                              </p>
                            )}
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{testResult.message}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit(onTestConnection)}
                disabled={isTesting}
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !testResult?.success}
              >
                {isCreating ? "Creating..." : "Create Connection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
