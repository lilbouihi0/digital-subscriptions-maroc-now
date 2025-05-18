
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeValidator from '@/components/admin/CodeValidator';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and verify spin wheel redemption codes</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Site
          </Button>
        </div>
        
        <Tabs defaultValue="codes">
          <TabsList className="mb-4">
            <TabsTrigger value="codes">Code Validator</TabsTrigger>
            <TabsTrigger value="stats" disabled>Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="codes" className="space-y-4">
            <Card className="p-6">
              <CodeValidator />
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="p-6">
              <p className="text-center text-gray-500">Statistics dashboard coming soon</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
