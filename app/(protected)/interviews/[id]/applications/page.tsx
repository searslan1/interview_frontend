// {"use client";

// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useParams } from "next/navigation";
// import { ApplicationList, ApplicationListItem } from "@/components/applications/ApplicationList";
// import { AdvancedFilters } from "@/components/applications/AdvancedFilters";
// import { Header } from "@/components/Header";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useApplicationStore } from "@/store/applicationStore";
// import { useInterviewStore } from "@/store/interviewStore";
// // Gerekli tipleri import edin
// import type { Interview } from "@/types/interview"; 
// import type { Application } from "@/types/application"; 



// export default function InterviewApplicationsPage() {
//   const params = useParams();
//   const id = Array.isArray(params.id) ? params.id[0] : params.id; 
//   const [filters, setFilters] = useState({});
//   // ✅ Düzeltme 1: fetchAllInterviews yerine fetchInterviews kullanıldı
//   const { interviews, fetchInterviews } = useInterviewStore(); 
//   // ✅ Düzeltme 2: isLoading yerine loading kullanıldı
//   const { applications, loading, fetchApplications, getApplicationsByInterviewId } = useApplicationStore();
//   const [personalityTypes, setPersonalityTypes] = useState<string[]>([]);
//   const [initialLoad, setInitialLoad] = useState(true);

//   // --- Veri Çekme Akışı ---
//   useEffect(() => {
//     // Tüm mülakatları ve ilgili başvuruları çek
//     fetchInterviews();
//     getApplicationsByInterviewId(id); // ✅ Mülakat ID'sine özel başvuruları çek
//     setPersonalityTypes(["INTJ", "ENTJ", "INFJ", "ENFJ", "ISTJ", "ESTJ", "ISFJ", "ESFJ"]); 
//   }, [id, fetchInterviews, getApplicationsByInterviewId]);

//   // --- Hata Çözümü: Asenkron Veri Dönüşümü ---
//   // ✅ Düzeltme 3: getApplicationsByInterviewId'dan gelen applications state'ini kullanıyoruz.
//   const formattedApplications: ApplicationListItem[] = useMemo(() => {
//     // applications (state'ten gelen) dizisini güvenli şekilde map ediyoruz.
//     return applications.map((app: Application) => ({ // app tipini Application olarak zorluyoruz
//         id: app._id || app.id, // ✅ Düzeltme 5: _id veya id'yi kullan
//         interviewId: app.interviewId,
//         candidateName: `${app.candidate.name} ${app.candidate.surname}`,
//         email: app.candidate.email,
//         status: app.status,
//         // ✅ Düzeltme 4: submissionDate yerine createdAt kullanıldı
//         submissionDate: new Date(app.createdAt).toISOString().split("T")[0], 
//         // ✅ Düzeltme 6: AI alanları güncellendi
//         aiScore: app.generalAIAnalysis?.overallScore ?? 0, 
//         // ✅ Düzeltme 7: Interview objesi _id yerine id kullanıyorsa düzeltilmeli
//         interviewTitle: interviews.find((i: Interview) => i._id === app.interviewId)?.title || "Bilinmeyen Mülakat",
//     }));
//   }, [applications, interviews]);


//   // --- Sonsuz Kaydırma (Infinity Scroll) Mantığı ---
//   const intObserver = useRef<IntersectionObserver>();
//   const lastApplicationRef = useCallback(
//     (node: HTMLTableRowElement | null) => {
//       // Sonsuz kaydırma mantığı burada kalır...
//       if (!node || !intObserver.current) return;

//       intObserver.current.disconnect();

//       intObserver.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           // Bu, tüm uygulamaları çeken genel metot olduğu için dikkatli olunmalıdır.
//           // Bu sayfada sadece bu mülakata ait olanlar çekildiği için, bu çağrı gereksiz olabilir.
//           // Eğer lazy loading istiyorsanız, ApplicationStore'da getApplicationsByInterviewId'nin sayfalama desteği olmalıdır.
//           // fetchApplications(); 
//         }
//       });

//       intObserver.current.observe(node);
//     },
//     [/* fetchApplications, sayfalama state'i */] 
//   );

//   const handleFilterChange = (newFilters: any) => {
//     setFilters(newFilters);
//     // TODO: Filtreler değiştiğinde getApplicationsByInterviewId(id) tekrar çağrılmalıdır.
//   };

//   // ✅ Düzeltme 2: loading kullanıldı
//   if (loading && initialLoad) return <LoadingSpinner />; 
//   if (!formattedApplications.length && !loading) return <div>Henüz başvuru yok.</div>;

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Header />
//       <main className="container mx-auto px-4 pt-20 pb-8">
//         <h1 className="text-3xl font-bold mb-6">Mülakat Başvuruları</h1>
//         <AdvancedFilters
//           onFilterChange={handleFilterChange}
//           interviews={interviews as any} // ✅ Düzeltme 8: Interview ID/Title tip uyuşmazlığı için geçici olarak 'any' kullanıldı.
//           personalityTypes={personalityTypes}
//         />
//         {/* ✅ Düzeltme 9: applications prop'u artık beklenen tipi taşıyor. */}
//         <ApplicationList applications={formattedApplications} lastApplicationRef={lastApplicationRef} />
//       </main>
//     </div>
//   );
// }
