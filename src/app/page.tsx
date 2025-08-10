"use client";

import Header from "@/components/Header/Header";
import Main from "@/components/Main/Main";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function Home() {
  const { data, loading, error } = useQuery(GET_SECTIONS);

  if (loading) return <p>Loading...</p>;
  if (error || !data?.sections) return <p>Error loading sections.</p>;

  const heroSection = data.sections.find(
    (section: Section) => section.id === "hero"
  );

  const aboutSection = data.sections.find(
    (section: Section) => section.id === "about"
  );

  const skillsSection = data.sections.find(
    (section: Section) => section.id === "skills"
  );

  return (
    <>
      <Header />
      <Main>
        <Hero
          title={heroSection.title}
          subtitle={heroSection.subtitle}
          description={heroSection.description}
        />
        <About title={aboutSection.title} content={aboutSection.content} />
        <Skills title={skillsSection.title} skills={skillsSection.skills} />
      </Main>
    </>
  );
}
