import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";

export default function ExamSubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <BackgroundGridPattern />
      <header className="px-4 pt-4">
        <Header page={"feedback"}/>
      </header>
      <main className="relative z-10 px-4 pb-10">{children}</main>
    </div>
  );
}