import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      status: "active"
    }
  });

  const { data: inventoryItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('id, name, location')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: siteInventoryData, isLoading: siteInventoryLoading } = useQuery({
    queryKey: ['site-inventory', selectedSite],
    queryFn: async () => {
      if (!selectedSite) return [];
      
      // Get all transactions for the selected site
      const { data: transactions, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          inventory_items (
            id,
            name,
            category,
            unit
          )
        `)
        .eq('site_id', selectedSite)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return transactions || [];
    }
  });

  const { data: siteStockSummary, isLoading: stockSummaryLoading } = useQuery({
    queryKey: ['site-stock-summary', selectedSite],
    queryFn: async () => {
      if (!selectedSite) return [];
      
      // Get latest stock levels per item for the selected site
      const { data, error } = await supabase
        .rpc('get_site_stock_summary', { site_id_param: selectedSite });
      
      if (error) {
        // Fallback: Calculate stock summary manually
        const { data: transactions, error: transError } = await supabase
          .from('inventory_transactions')
          .select(`
            item_id,
            new_stock,
            created_at,
            inventory_items (
              id,
              name,
              category,
              unit
            )
          `)
          .eq('site_id', selectedSite)
          .order('created_at', { ascending: false });
        
        if (transError) throw transError;
        
        // Group by item_id and get latest stock
        const stockMap = new Map();
        transactions?.forEach(transaction => {
          if (!stockMap.has(transaction.item_id)) {
            stockMap.set(transaction.item_id, {
              item_id: transaction.item_id,
              current_stock: transaction.new_stock,
              item_name: transaction.inventory_items?.name,
              item_category: transaction.inventory_items?.category,
              item_unit: transaction.inventory_items?.unit,
              last_updated: transaction.created_at
            });
          }
        });
        
        return Array.from(stockMap.values());
      }
      
      return data || [];
    }
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const { error } = await supabase
        .from('inventory_items')
        .insert([itemData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create inventory item",
        variant: "destructive",
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: any) => {
      const { error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive",
      });
    }
  });

  const filteredItems = inventoryItems?.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      name: item.name || "",
      category: item.category || "",
      unit: item.unit || "",
      status: item.status || "active"
    });
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    form.reset({
      name: "",
      category: "",
      unit: "",
      status: "active"
    });
    setIsAddDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingItem) {
      updateItemMutation.mutate({
        id: editingItem.id,
        ...data
      });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'bg-green-100 text-green-800';
      case 'out': return 'bg-red-100 text-red-800';
      case 'adjustment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="site-inventory">Site Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {itemsLoading ? (
                <div>Loading inventory items...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category || 'N/A'}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteItemMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site-inventory" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {sites?.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name} - {site.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSite ? (
            <div className="space-y-6">
              {/* Stock Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Current Stock Levels - {sites?.find(s => s.id === selectedSite)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stockSummaryLoading ? (
                    <div>Loading stock summary...</div>
                  ) : siteStockSummary && siteStockSummary.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteStockSummary.map((stock: any) => (
                          <TableRow key={stock.item_id}>
                            <TableCell className="font-medium">{stock.item_name}</TableCell>
                            <TableCell>{stock.item_category || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={stock.current_stock > 0 ? "default" : "destructive"}>
                                {stock.current_stock}
                              </Badge>
                            </TableCell>
                            <TableCell>{stock.item_unit}</TableCell>
                            <TableCell>
                              {stock.last_updated ? new Date(stock.last_updated).toLocaleDateString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No stock data available for this site</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transactions History Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {siteInventoryLoading ? (
                    <div>Loading transactions...</div>
                  ) : siteInventoryData && siteInventoryData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Previous Stock</TableHead>
                          <TableHead>New Stock</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteInventoryData.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{transaction.inventory_items?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {transaction.inventory_items?.category} • {transaction.inventory_items?.unit}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                                {transaction.transaction_type}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>{transaction.previous_stock}</TableCell>
                            <TableCell>{transaction.new_stock}</TableCell>
                            <TableCell>
                              {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>{transaction.notes || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found for this site</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Site</h3>
                <p className="text-muted-foreground text-center">
                  Choose a site from the dropdown above to view its inventory stock levels and transaction history.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kg, pcs, liters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createItemMutation.isPending}>
                  {createItemMutation.isPending ? "Creating..." : "Create Item"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kg, pcs, liters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateItemMutation.isPending}>
                  {updateItemMutation.isPending ? "Updating..." : "Update Item"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
