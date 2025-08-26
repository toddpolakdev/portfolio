"use client";

import Header from "@/components/Header/Header";
import Main from "@/components/Main/Main";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import Experience from "@/components/Experience/Experience";
import Education from "@/components/Education/Education";
import Contact from "@/components/Contact/Contact";
import Loader from "@/components/Loader";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function Home() {
  const { data, loading, error } = useQuery(GET_SECTIONS);

  if (loading) return <Loader />;
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

  const experienceSection = data.sections.find(
    (section: Section) => section.id === "experience"
  );

  const educationSection = data.sections.find(
    (section: Section) => section.id === "education"
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
        <Experience
          title={experienceSection.title}
          experience={experienceSection.experience}
        />
        <Education
          title={educationSection.title}
          education={educationSection.education}
        />
        <Contact />
      </Main>
    </>
  );
}
