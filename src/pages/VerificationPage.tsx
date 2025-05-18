
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { verifyCode } from '../api/verifyCode';
import { useToast } from '@/hooks/use-toast';

const VerificationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, dir } = useLanguage();
  const { toast } = useToast();

  const handleVerifyCode = async () => {
    if (!phoneNumber || !code) {
      setMessage('Please enter both phone number and verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyCode(phoneNumber, code);
      if (result.success) {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified successfully.",
          variant: "default",
        });
        setMessage('Phone number verified successfully.');
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        setMessage('Invalid verification code.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again later.",
        variant: "destructive",
      });
      setMessage('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4" dir={dir}>
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t('spinner.verificationCode')}</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">{t('spinner.enterCode')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium dark:text-gray-300">{t('spinner.enterPhone')}</label>
            <Input
              id="phone"
              type="tel"
              placeholder="+212 XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium dark:text-gray-300">{t('spinner.verificationCode')}</label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {message && (
            <p className={`text-sm font-medium ${message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-teal hover:bg-teal/90 dark:bg-blue-600 dark:hover:bg-blue-700" 
            onClick={handleVerifyCode}
            disabled={isLoading}
          >
            {isLoading ? t('spinner.verifying') : t('spinner.verifyCode')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPage;
