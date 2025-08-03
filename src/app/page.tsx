"use client";

import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Hero from "./components/Hero/Hero";
import { useQuery } from "@apollo/client";
import type { Section } from "@/types/types";
import { GET_SECTIONS } from "@/queries/getSections";

export default function Home() {
  const { data, loading, error } = useQuery(GET_SECTIONS);

  console.log("data", data);

  if (loading) return <p>Loading...</p>;
  if (error || !data?.sections) return <p>Error loading sections.</p>;

  const heroSection = data.sections.find(
    (section: Section) => section.id === "hero"
  );

  if (!heroSection) return <p>Hero section not found.</p>;

  const { title, subtitle, description } = heroSection;

  return (
    <>
      <Header />
      <Main>
        <Hero title={title} subtitle={subtitle} description={description} />
      </Main>
    </>
  );
}
