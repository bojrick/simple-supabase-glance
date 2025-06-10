import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MaterialRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: materialRequests, isLoading } = useQuery({
    queryKey: ['material-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_requests')
        .select(`
          *,
          users:user_id (
            name,
            phone
          ),
          sites:site_id (
            name,
            location
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string, status: string }) => {
      const { error } = await supabase
        .from('material_requests')
        .update({ status })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('material_requests')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
      toast({
        title: "Success",
        description: "Material request deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete material request",
        variant: "destructive",
      });
    }
  });

  const filteredRequests = materialRequests?.filter(request => 
    request.material_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.sites?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (requestId: string) => {
    if (window.confirm("Are you sure you want to delete this material request?")) {
      deleteRequestMutation.mutate(requestId);
    }
  };

  const handleStatusUpdate = (requestId: string, status: string) => {
    updateStatusMutation.mutate({ requestId, status });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageUrl = (imageKey: string | null) => {
    if (!imageKey) return null;
    return `https://pub-480de15262b346c8b5ebf5e8141b43f9.r2.dev/${imageKey}`;
  };

  if (isLoading) {
    return <div className="p-6">Loading material requests...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Material Requests</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search material requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Material Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.image_key ? (
                      <img 
                        src={getImageUrl(request.image_key)} 
                        alt="Material" 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{request.material_name || 'N/A'}</TableCell>
                  <TableCell>{request.quantity || 0} {request.unit || ''}</TableCell>
                  <TableCell>{request.sites?.name || 'N/A'}</TableCell>
                  <TableCell>{request.users?.name || request.users?.phone || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency || 'medium'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(request.id)}
                        disabled={deleteRequestMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialRequests;