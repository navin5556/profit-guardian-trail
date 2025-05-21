
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ZerodhaAccount } from "@/types";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, ExternalLink, Key, Link, RefreshCw, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const zerodhaSchema = z.object({
  api_key: z.string().min(6, { message: "API key must be at least 6 characters" }),
  api_secret: z.string().min(6, { message: "API secret must be at least 6 characters" }),
});

type ZerodhaFormValues = z.infer<typeof zerodhaSchema>;

export default function ZerodhaIntegration() {
  const { user } = useAuth();
  const [zerodhaAccount, setZerodhaAccount] = useState<ZerodhaAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoTrading, setAutoTrading] = useState(false);

  const form = useForm<ZerodhaFormValues>({
    resolver: zodResolver(zerodhaSchema),
    defaultValues: {
      api_key: "",
      api_secret: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchZerodhaAccount();
    }
  }, [user]);

  const fetchZerodhaAccount = async () => {
    try {
      setLoading(true);
      
      // Use type casting as a temporary solution to work with the new table
      const { data, error } = await supabase
        .from("zerodha_accounts")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setZerodhaAccount(data as unknown as ZerodhaAccount);
        setAutoTrading(data.is_connected);
      }
    } catch (error) {
      console.error("Error fetching Zerodha account:", error);
      toast.error("Failed to load Zerodha account details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ZerodhaFormValues) => {
    try {
      setIsSubmitting(true);

      if (zerodhaAccount) {
        // Update existing account
        const { error } = await supabase
          .from("zerodha_accounts")
          .update({
            api_key: values.api_key,
            api_secret: values.api_secret,
            updated_at: new Date().toISOString(),
          })
          .eq("id", zerodhaAccount.id);

        if (error) throw error;
        
        toast.success("Zerodha API credentials updated successfully");
      } else {
        // Create new account
        const { error } = await supabase
          .from("zerodha_accounts")
          .insert({
            user_id: user!.id,
            api_key: values.api_key,
            api_secret: values.api_secret,
            is_connected: false,
          });

        if (error) throw error;
        
        toast.success("Zerodha API credentials saved successfully");
      }

      fetchZerodhaAccount();
      form.reset();
    } catch (error) {
      console.error("Error saving Zerodha credentials:", error);
      toast.error("Failed to save Zerodha API credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAutoTrading = async () => {
    try {
      if (!zerodhaAccount) return;

      const newStatus = !autoTrading;
      setAutoTrading(newStatus);

      const { error } = await supabase
        .from("zerodha_accounts")
        .update({
          is_connected: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", zerodhaAccount.id);

      if (error) throw error;
      
      toast.success(`Auto trading ${newStatus ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      console.error("Error toggling auto trading:", error);
      toast.error("Failed to update auto trading status");
      setAutoTrading(!autoTrading); // Revert UI state on error
    }
  };

  const initiateZerodhaAuth = () => {
    // In a real implementation, this would redirect to Zerodha OAuth
    toast.info("This would redirect to Zerodha for authentication");
    window.open("https://kite.zerodha.com/connect/login", "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Zerodha Integration</h1>
        <p className="text-muted-foreground">
          Connect your Zerodha account to enable automatic trailing stop-loss
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Key size={18} /> Zerodha API Configuration
            </div>
          </CardTitle>
          <CardDescription>
            Enter your Zerodha API credentials to connect your trading account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="zerodha-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your Zerodha API key" 
                        {...field} 
                        type="password" 
                      />
                    </FormControl>
                    <FormDescription>
                      Your Zerodha API key is used to authenticate with the Zerodha API
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your Zerodha API secret" 
                        {...field} 
                        type="password" 
                      />
                    </FormControl>
                    <FormDescription>
                      Your Zerodha API secret is required for secure API access
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              window.open("https://kite.trade/docs/connect/v3/", "_blank");
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Zerodha API Docs
          </Button>
          <Button
            type="submit"
            form="zerodha-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Credentials"}
          </Button>
        </CardFooter>
      </Card>

      {zerodhaAccount && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Account Connection Status</CardTitle>
              <CardDescription>
                Current status of your Zerodha account connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <p className="font-medium">API Connection</p>
                  <p className="text-sm text-muted-foreground">
                    {zerodhaAccount.access_token ? "Connected" : "Not authenticated"}
                  </p>
                </div>
                <div>
                  {zerodhaAccount.access_token ? (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <RefreshCw size={14} /> Refresh Token
                    </Button>
                  ) : (
                    <Button
                      onClick={initiateZerodhaAuth}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Link size={14} /> Connect Account
                    </Button>
                  )}
                </div>
              </div>

              <Alert
                className={zerodhaAccount.access_token ? "bg-green-500/10" : "bg-yellow-500/10 border-yellow-500/50"}
              >
                <div className="flex items-center gap-2">
                  {zerodhaAccount.access_token ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <AlertTitle>
                    {zerodhaAccount.access_token
                      ? "Account Connected"
                      : "Authentication Required"}
                  </AlertTitle>
                </div>
                <AlertDescription className="pl-6 mt-2">
                  {zerodhaAccount.access_token
                    ? "Your Zerodha account is connected and ready for auto trading."
                    : "Please authenticate with Zerodha to enable auto trading features."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto Trading Settings</CardTitle>
              <CardDescription>
                Enable or disable automatic trading with your configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Automatic Trading</div>
                  <div className="text-sm text-muted-foreground">
                    {autoTrading
                      ? "Trading bot is active and will execute your configurations"
                      : "Trading bot is inactive"}
                  </div>
                </div>
                <Switch
                  checked={autoTrading}
                  onCheckedChange={toggleAutoTrading}
                  disabled={!zerodhaAccount.access_token}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
