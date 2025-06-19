import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Clock, MapPin, User, Calendar, Expand, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingActivity, setEditingActivity] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm({
    defaultValues: {
      activity_type: "",
      description: "",
      hours: 0
    }
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
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

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...activityData }: any) => {
      const { error } = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setIsEditDialogOpen(false);
      setEditingActivity(null);
      form.reset();
      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive",
      });
    }
  });

  const filteredActivities = activities?.filter(activity => 
    activity.activity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (activityId: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    form.reset({
      activity_type: activity.activity_type || "",
      description: activity.description || "",
      hours: activity.hours || 0
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingActivity) {
      updateActivityMutation.mutate({
        id: editingActivity.id,
        ...data
      });
    }
  };

  const getImageUrl = (imageKey: string | null) => {
    if (!imageKey) return null;
    return `https://pub-480de15262b346c8b5ebf5e8141b43f9.r2.dev/${imageKey}`;
  };

  const handleImageClick = (imageKey: string) => {
    const imageUrl = getImageUrl(imageKey);
    setSelectedImage(imageUrl);
    setImageZoom(1);
    setIsImageDialogOpen(true);
  };

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsViewDialogOpen(true);
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setImageZoom(1);
  };

  const formatDateTime = (dateString: string) => {
    // Create date and ensure it's treated as UTC, then convert to IST
    const utcDate = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
    
    // Convert to IST by adding 5 hours 30 minutes
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
    
    return istDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading activities...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Activities Management</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          All Activities ({filteredActivities.length})
        </h2>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {activity.image_key ? (
                    <div className="relative group">
                      <img 
                        src={getImageUrl(activity.image_key)} 
                        alt="Activity" 
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(activity.image_key)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {activity.activity_type || 'Untitled Activity'}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {activity.hours || 0}h
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(activity.id)}
                    disabled={deleteActivityMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {activity.sites?.name || 'No site'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="truncate">
                      {activity.users?.name || activity.users?.phone || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {activity.created_at ? formatDateTime(activity.created_at) : 'No date'}
                  </span>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewActivity(activity)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Complete Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm 
                ? `No activities match "${searchTerm}". Try adjusting your search.`
                : "No activities have been recorded yet. Add your first activity to get started."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Image Enlargement Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Activity Image</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={imageZoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(imageZoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={imageZoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetZoom}
                >
                  Reset
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedImage ? (
            <div className="relative w-full flex justify-center overflow-auto max-h-[80vh]">
              <img 
                src={selectedImage} 
                alt="Activity Image" 
                className="rounded-lg cursor-zoom-in"
                style={{
                  transform: `scale(${imageZoom})`,
                  transformOrigin: 'center',
                  maxWidth: 'none',
                  maxHeight: 'none'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p>No image to display</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Complete Activity Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-6">
              {/* Activity Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedActivity.activity_type || 'Untitled Activity'}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">
                      {selectedActivity.hours || 0} hours
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedActivity.created_at ? formatDateTime(selectedActivity.created_at) : 'No date'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Image */}
              {selectedActivity.image_key && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Activity Image</h3>
                  <div className="relative w-full flex justify-center">
                    <img 
                      src={getImageUrl(selectedActivity.image_key)} 
                      alt="Activity" 
                      className="max-w-full max-h-96 object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(selectedActivity.image_key)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Click image to enlarge with zoom controls
                  </p>
                </div>
              )}

              {/* Activity Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedActivity.description || 'No description provided'}
                </p>
              </div>

              {/* Location and User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Site Information
                  </h3>
                  <div className="space-y-1">
                    <p><strong>Site:</strong> {selectedActivity.sites?.name || 'No site assigned'}</p>
                    <p><strong>Location:</strong> {selectedActivity.sites?.location || 'No location'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </h3>
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {selectedActivity.users?.name || 'Unknown'}</p>
                    <p><strong>Phone:</strong> {selectedActivity.users?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {selectedActivity.details && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Additional Details</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedActivity.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter activity type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter activity description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter hours worked" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
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
                <Button type="submit" disabled={updateActivityMutation.isPending}>
                  {updateActivityMutation.isPending ? "Updating..." : "Update Activity"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;