import { useState, useEffect } from "react";
import { Loader2, Trash2, Package, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/products";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const paymentLabels: Record<string, string> = {
  cash: "Cash on Delivery",
  vodafone: "Vodafone Cash",
  instapay: "InstaPay",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  const refresh = async () => {
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleStatus = async (id: string, status: string) => {
    setActionId(id);
    await updateOrderStatus(id, status);
    toast.success(`Order ${status.toLowerCase()}`);
    await refresh();
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
    await deleteOrder(id);
    toast.success("Order deleted");
    await refresh();
    setActionId(null);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-primary" size={24} />
        <h2 className="font-heading text-2xl font-bold">Orders</h2>
        <Badge variant="secondary">{orders.length}</Badge>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="mx-auto mb-3" size={48} />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{order.customer_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer_phone} • {order.customer_address}</p>
                  <p className="text-sm mt-1">
                    <strong>Product:</strong> {order.product_name} •{" "}
                    <strong>Payment:</strong> {paymentLabels[order.payment_method] || order.payment_method}
                  </p>
                  {order.weight_option && (
                    <p className="text-xs text-primary mt-0.5">Weight: {order.weight_option}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                  {order.status === "Pending" && (
                    <Button size="sm" disabled={actionId === order.id} onClick={() => handleStatus(order.id, "Confirmed")}>
                      {actionId === order.id ? <Loader2 className="animate-spin" size={14} /> : "Confirm"}
                    </Button>
                  )}
                  {order.status === "Confirmed" && (
                    <Button size="sm" disabled={actionId === order.id} onClick={() => handleStatus(order.id, "Delivered")}>
                      {actionId === order.id ? <Loader2 className="animate-spin" size={14} /> : "Delivered"}
                    </Button>
                  )}
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <Button size="sm" variant="outline" disabled={actionId === order.id} onClick={() => handleStatus(order.id, "Cancelled")}>
                      Cancel
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" disabled={actionId === order.id} onClick={() => handleDelete(order.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Payment screenshot */}
              {order.payment_screenshot_url && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <ImageIcon size={14} /> Payment Screenshot:
                  </p>
                  <img
                    src={order.payment_screenshot_url}
                    alt="Payment proof"
                    className="w-32 h-24 rounded-lg object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setViewScreenshot(order.payment_screenshot_url)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Screenshot lightbox */}
      {viewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setViewScreenshot(null)} />
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setViewScreenshot(null)}
              className="absolute -top-3 -right-3 p-2 bg-card border border-border rounded-full shadow-lg hover:bg-muted z-10"
            >
              <X size={18} />
            </button>
            <img src={viewScreenshot} alt="Payment proof" className="w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
