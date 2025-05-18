
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { sendCode } from '../api/verification';

const VerificationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  
  // Debug language state
  console.log("Current language:", language);
  console.log("Direction:", dir);
  console.log("Translated example:", t('spinner.phoneVerification'));
  
  const handleSendCode = async () => {
    if (!phoneNumber) {
      setMessage(t('spinner.invalidPhone'));
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sendCode(phoneNumber);
      if (result.success) {
        toast({
          title: t("spinner.codeSent"),
          description: t("spinner.checkWhatsApp"),
          variant: "default",
        });
        setMessage(t('spinner.codeSent'));
      } else {
        toast({
          title: t("spinner.error"),
          description: t("spinner.sendError"),
          variant: "destructive",
        });
        setMessage(t('spinner.sendError'));
      }
    } catch (error) {
      console.error('Error sending code:', error);
      toast({
        title: t("spinner.error"),
        description: t("spinner.sendError"),
        variant: "destructive",
      });
      setMessage(t('spinner.sendError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4" dir={dir}>
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t('spinner.phoneVerification') || 'Phone Verification'}</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">{t('spinner.enterPhone') || 'Enter your phone number'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium dark:text-gray-300">
              {t('spinner.enterPhone') || 'Enter your phone number'}
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+212 XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {message && (
            <p className={`text-sm font-medium ${message.includes('sent') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-blue-600 dark:hover:bg-blue-700" 
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (t('spinner.sending') || 'Sending...') : (t('spinner.sendVerificationCode') || 'Send Verification Code')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPage;
