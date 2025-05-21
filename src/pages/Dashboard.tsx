import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TradeConfig } from "@/types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const configSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  trailing_stop_type: z.enum(["percentage", "difference"], {
    required_error: "Please select a trailing stop type",
  }),
  trailing_value: z.coerce
    .number()
    .positive({ message: "Value must be positive" })
    .min(0.1, { message: "Value must be at least 0.1" }),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export default function Dashboard() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<TradeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      name: "",
      trailing_stop_type: "percentage",
      trailing_value: 2.5,
    },
  });

  useEffect(() => {
    if (user) {
      fetchConfigs();
    }
  }, [user]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("trading_configs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setConfigs(data as TradeConfig[]);
    } catch (error) {
      console.error("Error fetching configs:", error);
      toast.error("Failed to load trading configurations");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ConfigFormValues) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("trading_configs").insert({
        user_id: user!.id,
        name: values.name,
        trailing_stop_type: values.trailing_stop_type,
        trailing_value: values.trailing_value,
      });

      if (error) {
        throw error;
      }

      toast.success("Configuration created successfully");
      form.reset({
        name: "",
        trailing_stop_type: "percentage",
        trailing_value: 2.5,
      });
      fetchConfigs();
    } catch (error) {
      console.error("Error creating config:", error);
      toast.error("Failed to create configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from("trading_configs")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Configuration deleted successfully");
      setConfigs(configs.filter((config) => config.id !== id));
    } catch (error) {
      console.error("Error deleting config:", error);
      toast.error("Failed to delete configuration");
    }
  };

  const toggleConfig = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("trading_configs")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(`Configuration ${!currentActive ? "activated" : "deactivated"} successfully`);
      setConfigs(
        configs.map((config) =>
          config.id === id ? { ...config, active: !currentActive } : config
        )
      );
    } catch (error) {
      console.error("Error toggling config:", error);
      toast.error("Failed to update configuration");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trading Configurations</h1>
        <p className="text-muted-foreground">
          Create and manage your trailing stop-loss configurations
        </p>
      </div>

      {/* New Config Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Configuration</CardTitle>
          <CardDescription>
            Set up a new trailing stop-loss configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="new-config-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Aggressive Stop-Loss" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this configuration
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trailing_stop_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop-Loss Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="difference">Price Difference</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How the trailing stop should be calculated
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trailing_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder={field.value.toString()}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {form.watch("trailing_stop_type") === "percentage"
                          ? "Percentage below highest price"
                          : "Price difference below highest price"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="new-config-form"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating..." : "Create Configuration"}
            <Plus size={16} className="ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {/* Existing Configs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Configurations</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : configs.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                You don't have any configurations yet. Create one above.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <Card
                key={config.id}
                className={`border ${
                  config.active
                    ? "border-green-500/30"
                    : "border-gray-700"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => deleteConfig(config.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <CardDescription>
                    Created on {new Date(config.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">
                        {config.trailing_stop_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">
                        {config.trailing_value}
                        {config.trailing_stop_type === "percentage" && "%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`font-medium ${
                          config.active
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {config.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={config.active ? "destructive" : "outline"}
                    className="w-full"
                    onClick={() => toggleConfig(config.id, config.active)}
                  >
                    {config.active ? "Deactivate" : "Activate"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
