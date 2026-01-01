import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [newState, setNewState] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [retirementReason, setRetirementReason] = useState("");

  const { data: inventory, isLoading: invLoading } = trpc.admin.inventory.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: stats, isLoading: statsLoading } = trpc.admin.inventory.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: subscriptions, isLoading: subsLoading } = trpc.admin.subscriptions.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateState = trpc.admin.inventory.updateState.useMutation({
    onSuccess: () => {
      toast.success("Inventory item updated");
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      setSelectedItem(null);
      setNewState("");
      setNotes("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const retireItem = trpc.admin.inventory.retire.useMutation({
    onSuccess: () => {
      toast.success("Item retired");
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      setSelectedItem(null);
      setRetirementReason("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const utils = trpc.useUtils();

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
            <Button>Go Home</Button>
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
    updateState.mutate({
      itemId: selectedItem,
      state: newState as any,
      notes: notes || undefined,
    });
  };

  const handleRetire = () => {
    if (!selectedItem || !retirementReason) {
      toast.error("Please select an item and provide a reason");
      return;
    }
    retireItem.mutate({
      itemId: selectedItem,
      reason: retirementReason,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-light tracking-wide text-neutral-900">Seasons</a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog">
              <a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Browse</a>
            </Link>
            <Link href="/dashboard">
              <a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Dashboard</a>
            </Link>
            <Link href="/admin">
              <a className="text-sm text-neutral-900 font-medium">Admin</a>
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
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">Brand</th>
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">State</th>
                        <th className="text-left py-3 px-2 font-medium text-neutral-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory?.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-3 px-2 text-neutral-700">{item.sku}</td>
                          <td className="py-3 px-2 text-neutral-900">{item.product?.name}</td>
                          <td className="py-3 px-2 text-neutral-700">{item.product?.brand}</td>
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
                    <div key={sub.subscription.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="font-medium text-neutral-900">{sub.user?.name}</div>
                        <div className="text-sm text-neutral-600">{sub.user?.email}</div>
                      </div>
                      <Badge
                        className={
                          sub.subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : sub.subscription.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }
                      >
                        {sub.subscription.status}
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
                    disabled={updateState.isPending}
                  >
                    {updateState.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update State"
                    )}
                  </Button>

                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <h3 className="font-medium text-neutral-900 mb-3">Retire Item</h3>
                    <div>
                      <Label>Retirement Reason</Label>
                      <Textarea
                        value={retirementReason}
                        onChange={(e) => setRetirementReason(e.target.value)}
                        placeholder="Describe damage or reason for retirement"
                        rows={3}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full mt-3"
                      onClick={handleRetire}
                      disabled={retireItem.isPending}
                    >
                      {retireItem.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Retiring...
                        </>
                      ) : (
                        "Retire Item"
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedItem(null);
                      setNewState("");
                      setNotes("");
                      setRetirementReason("");
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
