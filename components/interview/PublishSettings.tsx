"use client";

import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

interface PublishSettingsProps {
  form: UseFormReturn<any>;
}

export function PublishSettings({ form }: PublishSettingsProps) {
  const generateUniqueLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 15);
    return `https://yourdomain.com/interview/${uniqueId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yayınlama ve Erişim Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="interviewLink">Özel Mülakat Linki</Label>
          <div className="flex space-x-2">
            <Input
              id="interviewLink"
              readOnly
              value={form.watch("interviewLink.link") || ""}
            />
            <Button
              onClick={() =>
                form.setValue("interviewLink.link", generateUniqueLink())
              }
            >
              Link Oluştur
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="linkExpirationDate">Link Geçerlilik Süresi</Label>
          <DatePicker
            id="linkExpirationDate"
            date={form.watch("interviewLink.expirationDate")}
            onSelect={(date) =>
              form.setValue("interviewLink.expirationDate", date as Date)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
