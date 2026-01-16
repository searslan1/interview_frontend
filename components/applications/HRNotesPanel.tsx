"use client";

import { useState } from "react";
import { HRNote } from "@/types/application";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit2, Save, X, Plus, Lock, Unlock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface HRNotesPanelProps {
  notes: HRNote[];
  onAddNote: (content: string, isPrivate: boolean) => Promise<void>;
  onUpdateNote: (noteId: string, updates: { content?: string; isPrivate?: boolean }) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  currentUserId?: string; // İzin kontrolü için
}

export function HRNotesPanel({ 
  notes = [], 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote,
  currentUserId 
}: HRNotesPanelProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteIsPrivate, setNewNoteIsPrivate] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    if (newNoteContent.trim().length < 10) {
      toast({
        title: "Uyarı",
        description: "Not en az 10 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onAddNote(newNoteContent, newNoteIsPrivate);
      setNewNoteContent("");
      setNewNoteIsPrivate(false);
      setIsAdding(false);
      toast({
        title: "Başarılı",
        description: "Not başarıyla eklendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Not eklenirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (note: HRNote) => {
    setEditingNoteId(note._id);
    setEditContent(note.content);
    setEditIsPrivate(note.isPrivate);
  };

  const handleSaveEdit = async (noteId: string) => {
    if (editContent.trim().length < 10) {
      toast({
        title: "Uyarı",
        description: "Not en az 10 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onUpdateNote(noteId, {
        content: editContent,
        isPrivate: editIsPrivate,
      });
      setEditingNoteId(null);
      toast({
        title: "Başarılı",
        description: "Not başarıyla güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Not güncellenirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
    setEditIsPrivate(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Bu notu silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(true);
    try {
      await onDeleteNote(noteId);
      toast({
        title: "Başarılı",
        description: "Not başarıyla silindi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Not silinirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">İK Notları</CardTitle>
          {!isAdding && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdding(true)}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Not
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Yeni Not Ekleme Formu */}
        {isAdding && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <Textarea
              placeholder="Not ekleyin (min. 10 karakter)..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-note-private"
                  checked={newNoteIsPrivate}
                  onCheckedChange={setNewNoteIsPrivate}
                  disabled={loading}
                />
                <Label htmlFor="new-note-private" className="text-sm flex items-center gap-2">
                  {newNoteIsPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  {newNoteIsPrivate ? "Özel Not" : "Genel Not"}
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setNewNoteContent("");
                    setNewNoteIsPrivate(false);
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                  İptal
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={loading || newNoteContent.trim().length < 10}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notlar Listesi */}
        {notes.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Henüz not eklenmemiş. İlk notu eklemek için "Yeni Not" butonuna tıklayın.
          </p>
        )}

        {notes.map((note) => {
          const isEditing = editingNoteId === note._id;
          const canEdit = currentUserId === note.userId;

          return (
            <div
              key={note._id}
              className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors"
            >
              {/* Not Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{note.userName}</p>
                    {note.isPrivate && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Özel
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(note.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                    {note.updatedAt && note.updatedAt !== note.createdAt && " (düzenlendi)"}
                  </p>
                </div>
                {canEdit && !isEditing && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(note)}
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={loading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Not İçeriği */}
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`edit-note-private-${note._id}`}
                        checked={editIsPrivate}
                        onCheckedChange={setEditIsPrivate}
                        disabled={loading}
                      />
                      <Label htmlFor={`edit-note-private-${note._id}`} className="text-sm flex items-center gap-2">
                        {editIsPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        {editIsPrivate ? "Özel Not" : "Genel Not"}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note._id)}
                        disabled={loading || editContent.trim().length < 10}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Kaydet
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
