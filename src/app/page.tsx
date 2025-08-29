"use client";

import Header from "@/components/Header/Header";
import Main from "@/components/Main/Main";

import Hero from "@/components/Hero/Hero";

import Hero_M from "@/components/Hero_M/Hero_M";

import About from "@/components/About/About";

import About_M from "@/components/About_M/About_M";

import Skills from "@/components/Skills/Skills";

import Experience from "@/components/Experience/Experience";

import Education from "@/components/Education/Education";

import Education_M from "@/components/Education_M";

import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Loader from "@/components/Loader";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function Home() {
  const { data, loading, error } = useQuery(GET_SECTIONS);

  if (error) {
    console.log("error: ", error);
    return;
  }

  if (loading) return <Loader />;

  const heroSection = data?.sections.find(
    (section: Section) => section.id === "hero"
  );

  const aboutSection = data?.sections.find(
    (section: Section) => section.id === "about"
  );

  const skillsSection = data?.sections.find(
    (section: Section) => section.id === "skills"
  );

  const experienceSection = data?.sections.find(
    (section: Section) => section.id === "experience"
  );

  const educationSection = data?.sections.find(
    (section: Section) => section.id === "education"
  );

  return (
    <>
      <Header />
      <Main>
        <Hero_M
          title={heroSection?.title}
          subtitle={heroSection?.subtitle}
          description={heroSection?.description}
        />
        <About_M title={aboutSection?.title} content={aboutSection?.content} />
        <Skills title={skillsSection?.title} skills={skillsSection?.skills} />
        <Experience
          title={experienceSection?.title}
          experience={experienceSection?.experience}
        />
        <Education
          title={educationSection?.title}
          education={educationSection?.education}
        />
        <Contact />
        <Footer />
      </Main>
    </>
  );
}
