
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ClipboardCheck, Check, AlertCircle } from "lucide-react";

const CodeValidator: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    phone?: string;
    prize?: string;
    created?: string;
    redeemed?: boolean;
    redeemedAt?: string;
  } | null>(null);

  const handleCheckCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code to validate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/validate-code?code=${encodeURIComponent(code.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate code');
      }
      
      setResult(data);
      
      if (data.valid) {
        toast({
          title: "Code Valid",
          description: `This code is ${data.redeemed ? 'already redeemed' : 'valid and not redeemed yet'}`,
          variant: data.redeemed ? "default" : "default",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "This code is not valid or does not exist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating code:', error);
      toast({
        title: "Error",
        description: "Failed to validate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Claim Code</CardTitle>
        <CardDescription>Check if a spin wheel code is valid and not redeemed</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code (e.g., FREE-ABX123)" 
            className="font-mono"
          />
          <Button 
            onClick={handleCheckCode}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
            ) : (
              <ClipboardCheck className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {result && (
          <div className={`p-4 rounded-md ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <div className={`rounded-full p-1.5 ${result.valid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {result.valid ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h4 className={`text-sm font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {result.valid ? 'Valid Code' : 'Invalid Code'}
                </h4>
                
                {result.valid && (
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p><strong>Phone:</strong> {result.phone || 'N/A'}</p>
                    <p><strong>Prize:</strong> {result.prize || 'N/A'}</p>
                    <p><strong>Created:</strong> {formatDate(result.created)}</p>
                    <p className={result.redeemed ? 'text-amber-600' : 'text-green-600'}>
                      <strong>Status:</strong> {result.redeemed ? 'Redeemed' : 'Not Redeemed'}
                    </p>
                    {result.redeemed && (
                      <p><strong>Redeemed At:</strong> {formatDate(result.redeemedAt)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">
          Admin use only. This tool validates spin wheel prize codes.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CodeValidator;
