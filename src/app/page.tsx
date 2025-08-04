"use client";

import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function Home() {
  const { data, loading, error } = useQuery(GET_SECTIONS);

  // console.log("data", data);

  if (loading) return <p>Loading...</p>;
  if (error || !data?.sections) return <p>Error loading sections.</p>;

  const heroSection = data.sections.find(
    (section: Section) => section.id === "hero"
  );

  const aboutSection = data.sections.find(
    (section: Section) => section.id === "about"
  );

  const { title, subtitle, description } = heroSection;

  console.log("aboutSection", aboutSection);

  return (
    <>
      <Header />
      <Main>
        <Hero title={title} subtitle={subtitle} description={description} />
        <About title={aboutSection.title} content={aboutSection.content} />
      </Main>
    </>
  );
}
