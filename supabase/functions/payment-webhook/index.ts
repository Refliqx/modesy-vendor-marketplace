import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY') ??  "";

export default {
  async fetch (req: Request) {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      })
    }

    try {
      const body = await req.json();

      const orderNumber = body.order_id;
      const statusCode = body.status_code;
      const grossAmount = body.gross_amount;
      const transactionStatus = body.transaction_status;
      const midtransSignature = body.signature_key;

      const textToHash = orderNumber + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(textToHash);

      const hasBuffer = await crypto.subtle.digest("SHA-512", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (calculatedSignature !== midtransSignature) {
        return new Response(JSON.stringify({
          error: "Failed Signature! Request denied."
        }), { status: 403, headers: { "Content-Type": "application/json" } });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      let newPaymentStatus = 'Pending';

      if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
        newPaymentStatus = 'Paid';
      } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
        newPaymentStatus = 'Failed';
      }

      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('order_number', orderNumber);

      if (error) {
        throw new Error(`Failed to update status in database: ${error.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Status pesanan ${orderNumber} berhasil diperbarui menjadi [${newPaymentStatus}].`;
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}