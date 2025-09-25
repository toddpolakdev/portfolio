"use client";

import Header from "@/components/Header/Header";
import Main from "@/components/Main/Main";
import Hero_M from "@/components/Hero_M/Hero_M";
import About_M from "@/components/About_M/About_M";
import Skills from "@/components/Skills/Skills";
import Experience from "@/components/Experience/Experience";
import Education from "@/components/Education/Education";
import Contact from "@/components/Contact/Contact";
import Projects from "@/components/Projects/Projects";
import Footer from "@/components/Footer/Footer";
import Loader from "@/components/Loader";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function HomeContent() {
  const { data, loading, error } = useQuery(GET_SECTIONS, {
    fetchPolicy: "cache-first",
  });

  if (error) {
    console.log("error: ", error);
    return null;
  }

  if (loading) return <Loader />;

  const heroSection = data?.sections.find((s: Section) => s.id === "hero");
  const aboutSection = data?.sections.find((s: Section) => s.id === "about");
  const skillsSection = data?.sections.find((s: Section) => s.id === "skills");
  const experienceSection = data?.sections.find(
    (s: Section) => s.id === "experience"
  );
  const educationSection = data?.sections.find(
    (s: Section) => s.id === "education"
  );

  return (
    <>
      <Header />
      <Main>
        <Hero_M {...heroSection} />
        <About_M {...aboutSection} />
        <Skills {...skillsSection} />
        <Experience {...experienceSection} />
        <Education {...educationSection} />
        <Projects />
        <Contact />
        <Footer />
      </Main>
    </>
  );
}
