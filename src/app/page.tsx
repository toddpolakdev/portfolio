import TopBar from "@/components/TopBar/TopBar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import Projects from "@/components/Projects/Projects";
import Experience from "@/components/Experience/Experience";
import Education from "@/components/Education/Education";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import RevealObserver from "@/components/Reveal/RevealObserver";
import CommandPalette from "@/components/CommandPalette/CommandPalette";
import { bySectionId, getProjects, getSections } from "@/lib/content";

// Copy lives in MongoDB and changes rarely; the admin portal revalidates these
// tags on save, so a 5-minute floor is just a backstop.
export const revalidate = 300;

export default async function Page() {
  const [sections, projects] = await Promise.all([
    getSections(),
    getProjects(),
  ]);

  const s = bySectionId(sections);

  return (
    <>
      <TopBar />

      <main>
        <Hero section={s.hero} projects={projects} />
        <About
          section={s.about}
          skills={s.skills}
          experience={s.experience}
          projects={projects}
        />
        <Skills section={s.skills} />
        <Projects projects={projects} />
        <Experience section={s.experience} />
        <Education section={s.education} />
        <Contact section={s.contact} />
      </main>

      <Footer hero={s.hero} />

      <RevealObserver />
      <CommandPalette projects={projects} />
    </>
  );
}
