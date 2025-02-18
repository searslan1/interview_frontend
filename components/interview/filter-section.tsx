"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  onFilterChange: (filters: any) => void;
  filters: Record<string, any>;
}

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [interviewType, setInterviewType] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = () => {
    onFilterChange({
      sortBy,
      interviewType,
      status,
      searchTerm,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* 🔹 Arama Alanı */}
      <Input
        type="text"
        placeholder="Başlık ara..."
        className="w-[220px] bg-gray-700 text-white px-3 py-2 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔹 Sıralama */}
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">En Yeni</SelectItem>
          <SelectItem value="oldest">En Eski</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Mülakat Türü */}
      <Select value={interviewType} onValueChange={setInterviewType}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Mülakat Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="technical">Teknik</SelectItem>
          <SelectItem value="behavioral">Davranışsal</SelectItem>
          <SelectItem value="personality">Kişilik Testi</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Mülakat Durumu */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="completed">Tamamlanan</SelectItem>
          <SelectItem value="draft">Taslak</SelectItem>
          <SelectItem value="published">Yayınlandı</SelectItem>
          <SelectItem value="inactive">Pasif</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Filtreleme Butonu */}
      <Button onClick={handleFilter}>Filtrele</Button>
    </div>
  );
}
