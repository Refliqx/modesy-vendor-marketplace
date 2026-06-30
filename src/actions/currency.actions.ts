"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchAndUpdateExchangeRates() {
  const apiKey = process.env.CURRENCYBEACON_API_KEY;
  if (!apiKey) {
    console.error("CURRENCYBEACON_API_KEY is not defined in environment variables.");
    return { error: "API key is not configured in .env.local" };
  }

  try {
    const url = `https://api.currencybeacon.com/v1/latest?api_key=${apiKey}&base=USD`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    
    if (!res.ok) {
      return { error: `Failed to fetch from CurrencyBeacon API (HTTP ${res.status})` };
    }

    const data = await res.json();
    if (!data || data.meta?.code !== 200 || !data.response?.rates) {
      return { error: data?.meta?.message || "Invalid response format from CurrencyBeacon API" };
    }

    const rates = data.response.rates;
    
    const targetCurrencies = ["USD", "EUR", "BRL", "GBP", "IDR", "INR", "NGN", "RUB", "TRY"];
    const ratesToUpdate: Record<string, number> = {
      USD: 1.0
    };

    for (const code of targetCurrencies) {
      if (code === "USD") continue;
      if (rates[code] !== undefined) {
        ratesToUpdate[code] = Number(rates[code]);
      }
    }

    const supabase = await createClient();
    const { error: rpcError } = await (supabase as any).rpc("update_currency_rates", {
      rates: ratesToUpdate
    });

    if (rpcError) {
      console.error("RPC Error updating currency rates:", rpcError);
      return { error: `Database update failed: ${rpcError.message}` };
    }

    revalidatePath("/", "layout");

    return { success: true, rates: ratesToUpdate };
  } catch (error: any) {
    console.error("Error in fetchAndUpdateExchangeRates server action:", error);
    return { error: error.message || "An unexpected error occurred while updating exchange rates" };
  }
}
