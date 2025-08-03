import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Hero from "./components/Hero/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <Main>
        <Hero title="" subtitle="" description="" />
      </Main>
    </>
  );
}
