import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getAllInventory, getInventoryStats, getAllSubscriptions, updateInventoryState } from "@/lib/supabase-db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { Loader2, Package, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [newState, setNewState] = useState<string>("");
  const [notes, setNotes] = useState("");

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: getAllInventory,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getInventoryStats,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ["admin", "subscriptions"],
    queryFn: getAllSubscriptions,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateStateMutation = useMutation({
    mutationFn: ({ itemId, state, notes }: { itemId: number; state: any; notes?: string }) =>
      updateInventoryState(itemId, state, notes),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Inventory item updated");
        queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        setSelectedItem(null);
        setNewState("");
        setNotes("");
      } else {
        toast.error(result.error || "Failed to update");
      }
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="p-8">
          <p className="text-neutral-600 mb-4">Admin access required</p>
          <Link href="/">
            <span className="inline-block">
              <Button>Go Home</Button>
            </span>
          </Link>
        </Card>
      </div>
    );
  }

  const handleUpdateState = () => {
    if (!selectedItem || !newState) {
      toast.error("Please select an item and state");
      return;
    }
    updateStateMutation.mutate({
      itemId: selectedItem,
      state: newState as any,
      notes: notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wide text-neutral-900">
            Seasons
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Browse
            </Link>
            <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="text-sm text-neutral-900 font-medium">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Admin Panel</h1>
          <p className="text-neutral-600">Manage inventory and operations</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : stats && (
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-neutral-600" />
                <h3 className="text-sm font-medium text-neutral-900">Total Items</h3>
              </div>
              <p className="text-3xl font-light text-neutral-900">{stats.total}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-neutral-900">Available</h3>
              </div>
              <p className="text-3xl font-light text-green-700">{stats.available}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-neutral-900">Active</h3>
              </div>
              <p className="text-3xl font-light text-blue-700">{stats.active}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-medium text-neutral-900">Quarantine</h3>
              </div>
              <p className="text-3xl font-light text-amber-700">{stats.quarantine}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-neutral-600" />
                <h3 className="text-sm font-medium text-neutral-900">Retired</h3>
              </div>
              <p className="text-3xl font-light text-neutral-700">{stats.retired}</p>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Inventory Table */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Inventory Management</h2>
              {invLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">SKU</th>
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">Product</th>
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">State</th>
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory?.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-3 px-2 text-neutral-700">{item.sku}</td>
                          <td className="py-3 px-2 text-neutral-900">{item.sanity_product_slug}</td>
                          <td className="py-3 px-2">
                            <Badge
                              className={
                                item.state === 'available'
                                  ? 'bg-green-100 text-green-800'
                                  : item.state === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.state === 'quarantine'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.state === 'in_transit'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }
                            >
                              {item.state}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItem(item.id)}
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Subscriptions */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Active Subscriptions</h2>
              {subsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  {subscriptions?.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="font-medium text-neutral-900">{sub.user?.name || 'Unknown'}</div>
                        <div className="text-sm text-neutral-600">{sub.user?.email || 'No email'}</div>
                      </div>
                      <Badge
                        className={
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : sub.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  ))}
                  {subscriptions?.length === 0 && (
                    <p className="text-center text-neutral-600 py-4">No subscriptions yet</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* State Management Panel */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Update Item State</h2>
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <Label>Selected Item</Label>
                    <Input
                      value={inventory?.find(i => i.id === selectedItem)?.sku || ""}
                      disabled
                      className="bg-neutral-50"
                    />
                  </div>

                  <div>
                    <Label>New State</Label>
                    <Select value={newState} onValueChange={setNewState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about this state change"
                      rows={3}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleUpdateState}
                    disabled={updateStateMutation.isPending}
                  >
                    {updateStateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update State"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedItem(null);
                      setNewState("");
                      setNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="text-center text-neutral-600 py-8">
                  Select an item from the table to manage its state
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
