import FadeContent from "@/components/effects/FadeContent";

const Home = () => {
  return (
    <div className="flex flex-col py-20 h-[calc(100vh-110px)]">
      <FadeContent>
        <h1 className="text-6xl font-bold mb-2 text-center">Secret Words</h1>
        <p className="text-lg text-center opacity-50">This is a secret words game. You need to guess the words by the hints.</p>
      </FadeContent >
    </div>
  )
}

export default Home